/* Win12 WebGL renderer.
 *
 * Modes (persisted in localStorage 'webgl-mode'):
 *   off     - pure browser DOM/CSS rendering (default).
 *   partial - legacy experimental WebGL overlay on top of the DOM.
 *   full    - WebGL is the primary *visual* layer, composed in the same
 *             stacking order as the DOM:
 *
 *                 ┌──────────────────────── viewport ───────────────────────┐
 *                 │  wallpaper canvas (z-index:-1, one WebGL context)       │
 *                 │                                                          │
 *                 │   .window (stacking ctx)  ── own panel canvas (child,    │
 *                 │   .window (stacking ctx)  ── own panel canvas  z:-1 in   │
 *                 │   #start-menu (z:91)      ── own panel canvas   element) │
 *                 │   .dock / #cm / widget    ── own panel canvas            │
 *                 │                                                          │
 *                 │   text / icons / inputs / iframes stay DOM, ON TOP of   │
 *                 │   the canvas inside each element.                       │
 *                 └──────────────────────────────────────────────────────────┘
 *
 *             Each panel's canvas lives INSIDE that element's stacking
 *             context, so when windows overlap the upper window's WebGL
 *             material paints ABOVE the lower window's DOM content - the
 *             browser z-ordering composites everything correctly. A single
 *             canvas behind the whole DOM cannot do this (the lower window's
 *             content would ghost through the upper window).
 *
 *   GEOMETRY CONTRACT (easy to get wrong, so spelled out):
 *     - The canvas is a child of the panel and every panel is a positioned
 *       element, so canvas `left/top` are PANEL-LOCAL px: the canvas sits at
 *       (-border - pad), never at the panel's viewport rect.
 *     - The canvas is exactly as large as the quad the vertex shader emits,
 *       so aPos maps straight onto clip space. It must NOT be mapped through
 *       the viewport size (that only works when the canvas covers the whole
 *       window, which panel canvases do not).
 *     - uScreenOrigin + uScale translate panel-local px back into screen px
 *       for the blur lookup, so an ancestor transform (the window open/close
 *       scale, `.window.min`) does not shear the material.
 *
 *   TEXTURE Y CONVENTION: every texture is uploaded with
 *   UNPACK_FLIP_Y_WEBGL, i.e. v = 1 is the top row of the source. The panel
 *   shader flips its screen-normalised y to match. ImageBitmap sources ignore
 *   that flag per spec, which is why the shared blur source is a plain 2D
 *   canvas and not an ImageBitmap.
 *
 *   Panel contexts come from a small pool (browsers cap live WebGL contexts,
 *   commonly ~8-16). Elements without a pool slot keep the normal DOM
 *   acrylic (the .gpu-panel paint-stripping class is only added when a
 *   layer is attached), so degradation is per-panel, never a hard failure.
 *   Contexts are released explicitly on destroy, and a pool limit that had to
 *   be lowered because the device refused a context is retried later.
 *
 *   Blur is GPU-only: a downscaled (~384px) copy of the wallpaper is shared
 *   as a canvas and uploaded once per panel context; the panel shader
 *   samples it with cover mapping + ring taps whose radius is expressed in
 *   SCREEN px, so the blur looks the same at every resolution. No DOM
 *   capture, no readPixels, no per-frame buffer/shader/texture creation.
 *   Static layers are not redrawn.
 *
 * Public API (window.win12WebGL):
 *   init() / apply(mode) / setMode(mode) / getMode()
 *   start(mode) / stop() / resize() / render() / destroy()
 *   supported() / getState()
 *
 * apply()/start() return the mode that is ACTUALLY running, which is 'off'
 * when the device cannot provide WebGL: callers must reflect that value in
 * the UI instead of the requested one.
 */
(function () {
  'use strict';

  const KEY = 'webgl-mode';
  const DEFAULT_MODE = 'off';
  const MODES = ['off', 'partial', 'full'];
  const MAX_DPR = 2;
  const POOL_SIZE = 12; // max simultaneous panel WebGL contexts
  const BLUR_SRC_MAX = 384; // px of the shared downscaled wallpaper
  const WALLPAPER_TEX_MAX = 2048; // px of the wallpaper texture (long side)
  const BLUR_RADIUS = 34; // px of wallpaper blur, in SCREEN px
  const POOL_RETRY_MS = 5000; // re-try a lowered pool limit after this long
  const MAX_HARD_FAILS = 3; // shader/build failures before panels are off
  const MAX_FRAME_ERRORS = 5; // consecutive frame errors before falling back

  // ---------------------------------------------------------------- utils

  function clamp01(v) {
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  /** 0..255 or 0..100% channel -> 0..1 */
  function chan(token, scale) {
    const s = String(token).trim();
    if (s.endsWith('%')) return clamp01(parseFloat(s) / 100);
    const n = parseFloat(s);
    return isFinite(n) ? clamp01(n / scale) : 0;
  }

  function hsl2rgb(h, s, l) {
    h = (((h % 360) + 360) % 360) / 360;
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const f = (t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    return [f(h + 1 / 3), f(h), f(h - 1 / 3)];
  }

  /**
   * Parse the colour syntaxes the Win12 theme actually uses: #rgb/#rgba/
   * #rrggbb/#rrggbbaa, rgb()/rgba() and hsl()/hsla() with either comma or
   * modern space/slash separators, plus `transparent`. Anything else returns
   * null so the caller can fall back to a hard-coded theme colour.
   * @returns {number[]|null} [r,g,b,a] in 0..1
   */
  function parseColor(str) {
    if (!str) return null;
    str = String(str).trim().toLowerCase();
    if (str === 'transparent') return [0, 0, 0, 0];
    if (str[0] === '#') {
      const h = str.slice(1);
      if (!/^[0-9a-f]+$/.test(h)) return null;
      if (h.length === 3 || h.length === 4) {
        const r = parseInt(h[0] + h[0], 16),
          g = parseInt(h[1] + h[1], 16),
          b = parseInt(h[2] + h[2], 16),
          a = h.length === 4 ? parseInt(h[3] + h[3], 16) : 255;
        return [r / 255, g / 255, b / 255, a / 255];
      }
      if (h.length === 6 || h.length === 8) {
        const r = parseInt(h.slice(0, 2), 16),
          g = parseInt(h.slice(2, 4), 16),
          b = parseInt(h.slice(4, 6), 16),
          a = h.length === 8 ? parseInt(h.slice(6, 8), 16) : 255;
        return [r / 255, g / 255, b / 255, a / 255];
      }
      return null;
    }
    const m = str.match(/^(rgba?|hsla?)\(([^)]*)\)$/);
    if (!m) return null;
    // split "r, g, b, a" / "r g b / a" / "h, s%, l%, a" into channels
    const [head, tail] = m[2].split('/');
    const parts = head
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean);
    let alpha = 1;
    if (tail !== undefined) alpha = chan(tail, 1);
    else if (parts.length > 3 && m[1].length > 3) alpha = chan(parts[3], 1);
    if (!isFinite(alpha)) alpha = 1;
    if (m[1][0] === 'r') {
      if (parts.length < 3) return null;
      return [
        chan(parts[0], 255),
        chan(parts[1], 255),
        chan(parts[2], 255),
        clamp01(alpha),
      ];
    }
    if (parts.length < 3) return null;
    const h = parseFloat(parts[0]);
    const [r, g, b] = hsl2rgb(
      isFinite(h) ? h : 0,
      chan(parts[1], 100),
      chan(parts[2], 100),
    );
    return [r, g, b, clamp01(alpha)];
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }

  /**
   * The theme colours live in :root custom properties that only change when
   * the root class or inline style changes, so cache them instead of asking
   * getComputedStyle() for six variables on every animated frame.
   */
  const Theme = {
    _sig: null,
    _value: null,
    /** @returns {{shadow:number[], unfoc:number[], bg70:number[], bg50:number[],
     *             ctxMenu:number[], moreBlur:boolean, colA:number[], colB:number[]}} */
    get() {
      const root = document.documentElement;
      const sig = root.className + '|' + (root.getAttribute('style') || '');
      if (sig === this._sig && this._value) return this._value;
      const v = (n, fb) => parseColor(cssVar(n)) || fb;
      this._sig = sig;
      this._value = {
        shadow: v('--shadow', [0, 0, 0, 0.63]),
        unfoc: v('--unfoc', [0.13, 0.13, 0.13, 1]),
        bg70: v('--bg70', [0.1, 0.1, 0.1, 0.77]),
        bg50: v('--bg50', [0.07, 0.07, 0.07, 0.63]),
        ctxMenu: v('--contextmeu', [0.11, 0.11, 0.11, 0.9]),
        colA: v('--theme-1', [0.83, 0.83, 0.83, 1]),
        colB: v('--theme-2', [0.46, 0.46, 0.46, 1]),
        moreBlur: root.classList.contains('moreblur'),
      };
      return this._value;
    },
  };

  function dpr() {
    return Math.min(window.devicePixelRatio || 1, MAX_DPR);
  }

  function linkProgram(gl, vsSrc, fsSrc) {
    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(s);
        gl.deleteShader(s);
        throw new Error('shader compile failed: ' + log);
      }
      return s;
    };
    const p = gl.createProgram();
    const vs = compile(gl.VERTEX_SHADER, vsSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fsSrc);
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(p);
      gl.deleteProgram(p);
      throw new Error('program link failed: ' + log);
    }
    return p;
  }

  function uniformMap(gl, program) {
    const map = {};
    const n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) || 0;
    for (let i = 0; i < n; i++) {
      const info = gl.getActiveUniform(program, i);
      map[info.name] = gl.getUniformLocation(program, info.name);
    }
    return map;
  }

  /** True when a 2D context holds nothing but transparent pixels. */
  function isBlankCanvas(ctx, w, h) {
    try {
      const d = ctx.getImageData(0, 0, w, h).data;
      for (let i = 3; i < d.length; i += 4) {
        if (d[i] !== 0) return false;
      }
      return true;
    } catch (_) {
      return false; // unreadable (tainted/zero-sized): assume it is fine
    }
  }

  /** Delete the GL objects a layer owns; contexts and VRAM are scarce. */
  function deleteGLObjects(gl, obj) {
    if (!gl || gl.isContextLost()) return;
    try {
      if (obj.tex) gl.deleteTexture(obj.tex);
      if (obj.program) gl.deleteProgram(obj.program);
      if (obj.quad) gl.deleteBuffer(obj.quad);
    } catch (_) {
      /* already gone */
    }
  }

  /**
   * Hand the context back right away. Browsers cap live WebGL contexts per
   * page (~16) and only reclaim them on GC, so a window that opens and closes
   * a few times would otherwise push the oldest context - possibly the
   * wallpaper one - out of the pool.
   */
  function releaseContext(gl) {
    if (!gl) return;
    try {
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    } catch (_) {
      /* nothing else we can do */
    }
  }

  // -------------------------------------------------------------- shaders
  // GLSL ES 1.00 (WebGL1 + WebGL2 compatible).

  // Full-viewport quad (wallpaper layer). aPos.y = 0 is the BOTTOM of the
  // screen here, which - together with UNPACK_FLIP_Y_WEBGL - makes vUV.y = 0
  // sample the bottom of the image.
  const QUAD_VS = `
    attribute vec2 aPos; // 0..1 unit quad
    varying vec2 vUV;
    void main() {
      vUV = aPos;
      gl_Position = vec4(aPos * 2.0 - 1.0, 0.0, 1.0);
    }`;

  const WALLPAPER_FS = `
    precision mediump float;
    varying vec2 vUV;
    uniform sampler2D uTex;
    uniform float uHasTex;
    uniform vec2 uCoverScale;
    uniform vec2 uCoverOffset;
    uniform vec4 uColA;
    uniform vec4 uColB;
    void main() {
      vec4 c;
      if (uHasTex > 0.5) {
        c = texture2D(uTex, vUV * uCoverScale + uCoverOffset);
      } else {
        c = mix(uColB, uColA, vUV.y);
      }
      gl_FragColor = vec4(c.rgb * c.a, c.a);
    }`;

  // One panel: wallpaper-blur "mica" fill / solid tint, inner border and a
  // soft drop shadow via a rounded-rect SDF. All geometry in element (local)
  // px; the backing store is canvasPx = local px * DPR and gl.viewport handles
  // the scaling - so the quad is mapped 1:1 onto clip space here.
  const PANEL_VS = `
    attribute vec2 aPos;      // 0..1 over (panel + 2*pad)
    uniform vec2 uViewport;   // screen size in CSS px
    // uSize is also declared by PANEL_FS: GLSL ES 1.00 requires the precision
    // to match between stages, and the fragment default is mediump.
    uniform mediump vec2 uSize; // panel border-box size, local px
    uniform float uPad;       // shadow margin, local px
    uniform vec2 uScreenOrigin; // panel border-box top-left, screen px (y down)
    uniform vec2 uScale;      // local px -> screen px (ancestor transforms)
    varying vec2 vLocal;      // panel-local px, origin at the border box
    varying vec2 vScreenN;    // 0..1 of the viewport, y down
    void main() {
      vec2 css = aPos * (uSize + 2.0 * uPad);      // canvas-local px
      vLocal = css - vec2(uPad);
      vScreenN = (uScreenOrigin + vLocal * uScale) / uViewport;
      gl_Position = vec4(aPos.x * 2.0 - 1.0, 1.0 - aPos.y * 2.0, 0.0, 1.0);
    }`;

  const PANEL_FS = `
    precision mediump float;
    varying vec2 vLocal;
    varying vec2 vScreenN;
    uniform vec2 uSize;
    uniform float uRadius;
    uniform vec4 uTint;
    uniform float uBlurMix;
    uniform sampler2D uWall;
    uniform vec2 uCoverScale;
    uniform vec2 uCoverOffset;
    uniform vec2 uBlurStep;   // wuv delta per screen px
    uniform float uSat;       // backdrop-filter saturate() of the panel kind
    uniform float uCon;       // backdrop-filter contrast() of the panel kind
    uniform vec4 uShadowColor;
    uniform vec2 uShadowOffset;
    uniform float uShadowBlur;
    uniform vec4 uBorderColor;
    uniform float uBorderWidth;
    uniform float uOpacity;

    float rbox(vec2 p, vec2 b, float r) {
      vec2 q = abs(p) - b + r;
      return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
    }

    vec3 wallpaperBlur(vec2 wuv) {
      vec3 c = texture2D(uWall, wuv).rgb * 0.30;
      float wsum = 0.30;
      // two 8-tap rings around the sample point; the source texture is tiny so
      // the bilinear upscale is already soft - these widen it to roughly the
      // CSS blur(60px) the acrylic rules use. Radii are in screen px via
      // uBlurStep, so the result does not depend on the source resolution.
      for (int i = 0; i < 8; i++) {
        float a = float(i) * 0.7853981; // pi/4
        vec2 dir = vec2(cos(a), sin(a));
        c += texture2D(uWall, wuv + dir * uBlurStep * 0.45).rgb * 0.05;
        c += texture2D(uWall, wuv + dir * uBlurStep).rgb * 0.0375;
        wsum += 0.0875;
      }
      return c / wsum;
    }

    void main() {
      vec2 halfSize = uSize * 0.5;
      vec2 p = vLocal - halfSize;
      float d = rbox(p, halfSize, uRadius);

      // --- shadow, outside the body only ---
      float ds = rbox(p - uShadowOffset, halfSize, uRadius);
      float fillMask = 1.0 - smoothstep(-0.75, 0.75, d);
      float shadowA = (1.0 - smoothstep(0.0, uShadowBlur, ds))
                    * uShadowColor.a * (1.0 - fillMask) * uOpacity;
      vec3 accRGB = uShadowColor.rgb * shadowA;
      float accA = shadowA;

      // --- fill: solid tint, or tint over blurred wallpaper ("mica") ---
      vec3 fillRGB = uTint.rgb;
      float fillA = uTint.a;
      if (uBlurMix > 0.001) {
        // vScreenN.y grows downwards while the texture is uploaded flipped
        // (v = 1 is the top row), hence the 1.0 - y.
        vec2 wuv = vec2(vScreenN.x * uCoverScale.x + uCoverOffset.x,
                        1.0 - (vScreenN.y * uCoverScale.y + uCoverOffset.y));
        vec3 blur = wallpaperBlur(wuv);
        // the same saturate()/contrast() the acrylic rules apply, per panel kind
        float luma = dot(blur, vec3(0.299, 0.587, 0.114));
        blur = mix(vec3(luma), blur, uSat);
        blur = mix(vec3(0.5), blur, uCon);
        vec3 mixRGB = mix(blur, uTint.rgb, uTint.a);
        float mixA = uTint.a + (1.0 - uTint.a);
        fillRGB = mix(uTint.rgb, mixRGB, uBlurMix);
        fillA = mix(uTint.a, mixA, uBlurMix);
      }

      // --- border stroke hugging the inside edge ---
      float bw = max(uBorderWidth, 0.0);
      float borderMask = 0.0;
      if (bw > 0.001 && uBorderColor.a > 0.001) {
        borderMask = (1.0 - smoothstep(-0.75, 0.75, abs(d + bw * 0.5) - bw * 0.5));
      }
      fillRGB = mix(fillRGB, uBorderColor.rgb, borderMask * uBorderColor.a);
      float fillAlpha = fillMask * fillA * uOpacity;

      vec3 outRGB = fillRGB * fillAlpha + accRGB * (1.0 - fillAlpha);
      float outA = fillAlpha + accA * (1.0 - fillAlpha);
      gl_FragColor = vec4(outRGB, outA);
    }`;

  // ---------------------------------------------------------- GL resources

  function createUnitQuad(gl) {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    return buf;
  }

  function coverTransform(viewW, viewH, imgW, imgH) {
    if (!imgW || !imgH) return { scale: [1, 1], offset: [0, 0] };
    const s = Math.max(viewW / imgW, viewH / imgH);
    const drawnW = imgW * s,
      drawnH = imgH * s;
    const offX = (viewW - drawnW) / 2,
      offY = (viewH - drawnH) / 2;
    return {
      scale: [viewW / drawnW, viewH / drawnH],
      offset: [-offX / drawnW, -offY / drawnH],
    };
  }

  // ------------------------------------------------------ wallpaper canvas

  class WallpaperLayer {
    constructor() {
      this.canvas = null;
      this.gl = null;
      this.program = null;
      this.quad = null;
      this.u = null;
      this.tex = null;
      this.texSize = [0, 0];
      this.dirty = true;
      this.lost = false;
    }

    init(onLost, onRestored) {
      const canvas = document.createElement('canvas');
      canvas.id = 'win12-webgl-canvas';
      canvas.className = 'win12-gl-bg';
      canvas.setAttribute('aria-hidden', 'true');
      const gl =
        canvas.getContext('webgl2', {
          alpha: true,
          premultipliedAlpha: true,
          antialias: false,
          depth: false,
          stencil: false,
        }) ||
        canvas.getContext('webgl', {
          alpha: true,
          premultipliedAlpha: true,
          antialias: false,
          depth: false,
          stencil: false,
        });
      if (!gl) return false;
      this.canvas = canvas;
      this.gl = gl;
      this.onLost = onLost;
      this.onRestored = onRestored;

      this._lost = (e) => {
        e.preventDefault();
        this.lost = true;
        this.onLost();
      };
      this._restored = () => {
        this.lost = false;
        this._build();
        this.dirty = true;
        this.onRestored();
      };
      canvas.addEventListener('webglcontextlost', this._lost);
      canvas.addEventListener('webglcontextrestored', this._restored);

      this._build();
      return true;
    }

    _build() {
      const gl = this.gl;
      deleteGLObjects(gl, this);
      this.tex = null;
      this.program = linkProgram(gl, QUAD_VS, WALLPAPER_FS);
      this.u = uniformMap(gl, this.program);
      this.aPos = gl.getAttribLocation(this.program, 'aPos');
      this.quad = createUnitQuad(gl);
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }

    setWallpaper(image) {
      const gl = this.gl;
      if (!gl) return;
      if (this.tex) {
        gl.deleteTexture(this.tex);
        this.tex = null;
      }
      this.texSize = [0, 0];
      if (!image) {
        this.dirty = true;
        return;
      }
      // Rasterise through a 2D canvas first. Two reasons:
      //  - WebGL refuses sources without intrinsic dimensions. The default
      //    Win12 wallpaper is an SVG carrying only a viewBox, and texImage2D
      //    fails on it with INVALID_VALUE while leaving an opaque BLACK
      //    texture behind (no JS exception, so a try/catch never sees it).
      //  - a vector wallpaper is then rasterised at screen resolution instead
      //    of the SVG default 150x150 (the DOM scales it crisply, so WebGL
      //    must as well).
      // The canvas keeps the image's aspect ratio; cover cropping stays in the
      // shader, which is why texSize is the rasterised size.
      let source = image;
      const iw = image.naturalWidth || image.width || 0;
      const ih = image.naturalHeight || image.height || 0;
      const aspect = iw > 0 && ih > 0 ? iw / ih : 1;
      const long = Math.min(
        WALLPAPER_TEX_MAX,
        Math.max(window.innerWidth, window.innerHeight) * dpr(),
      );
      let tw, th;
      if (aspect >= 1) {
        tw = Math.max(1, Math.round(long));
        th = Math.max(1, Math.round(long / aspect));
      } else {
        th = Math.max(1, Math.round(long));
        tw = Math.max(1, Math.round(long * aspect));
      }
      try {
        const c = document.createElement('canvas');
        c.width = tw;
        c.height = th;
        c.getContext('2d').drawImage(image, 0, 0, tw, th);
        source = c;
      } catch (err) {
        console.warn(
          'Win12 WebGL: wallpaper rasterise failed, uploading as-is:',
          err && err.message,
        );
        tw = iw;
        th = ih;
      }
      try {
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        // v = 1 is the top row of the image (see the header contract)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.getError(); // drop stale flags so the check below is meaningful
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          source,
        );
        const err = gl.getError();
        if (err !== gl.NO_ERROR) {
          gl.deleteTexture(tex);
          throw new Error('texImage2D failed with gl error ' + err);
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        this.tex = tex;
        this.texSize = [tw, th];
      } catch (err) {
        // gradient fallback (the shader draws the theme gradient instead)
        console.warn(
          'Win12 WebGL: wallpaper texture rejected, using gradient:',
          err && err.message,
        );
        this.tex = null;
        this.texSize = [0, 0];
      }
      this.dirty = true;
    }

    resize() {
      if (!this.canvas) return;
      const s = dpr();
      const w = Math.max(1, Math.round(window.innerWidth * s));
      const h = Math.max(1, Math.round(window.innerHeight * s));
      if (this.canvas.width !== w || this.canvas.height !== h) {
        this.canvas.width = w;
        this.canvas.height = h;
        this.dirty = true;
      }
    }

    render(colA, colB) {
      if (!this.gl || this.lost || !this.dirty) return;
      const gl = this.gl;
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(this.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
      gl.enableVertexAttribArray(this.aPos);
      gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
      const cov = coverTransform(
        window.innerWidth,
        window.innerHeight,
        this.texSize[0],
        this.texSize[1],
      );
      gl.uniform2f(this.u.uCoverScale, cov.scale[0], cov.scale[1]);
      gl.uniform2f(this.u.uCoverOffset, cov.offset[0], cov.offset[1]);
      if (this.tex) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.uniform1i(this.u.uTex, 0);
        gl.uniform1f(this.u.uHasTex, 1);
      } else {
        gl.uniform1f(this.u.uHasTex, 0);
      }
      gl.uniform4fv(this.u.uColA, colA);
      gl.uniform4fv(this.u.uColB, colB);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      this.dirty = false;
    }

    destroy() {
      if (this.canvas) {
        if (this._lost)
          this.canvas.removeEventListener('webglcontextlost', this._lost);
        if (this._restored)
          this.canvas.removeEventListener(
            'webglcontextrestored',
            this._restored,
          );
        this.canvas.remove();
      }
      this._lost = this._restored = null;
      deleteGLObjects(this.gl, this);
      releaseContext(this.gl);
      this.tex = null;
      this.program = null;
      this.quad = null;
      this.u = null;
      this.canvas = null;
      this.gl = null;
      this.onLost = this.onRestored = null;
      this.dirty = true;
      this.lost = false;
    }
  }

  // -------------------------------------------------------- one panel layer
  // A canvas attached INSIDE one panel element, with its own GL context.

  let layerSeq = 0;

  class PanelLayer {
    constructor(el) {
      this.id = ++layerSeq;
      this.el = el;
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'win12-gl-panel';
      this.canvas.setAttribute('aria-hidden', 'true');
      this.gl = null;
      this.program = null;
      this.quad = null;
      this.u = null;
      this.aPos = 0;
      this.tex = null;
      this.texKey = null;
      this.desc = null;
      this.dirty = true;
      this.lost = false;
      this._sig = null;
      this._pad = 0;
      this._dead = false;
    }

    /** @returns {boolean} context acquired */
    attach() {
      const attrs = {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'low-power',
      };
      const gl =
        this.canvas.getContext('webgl2', attrs) ||
        this.canvas.getContext('webgl', attrs);
      if (!gl) return false;
      this.gl = gl;
      this.el.insertBefore(this.canvas, this.el.firstChild);
      this.el.classList.add('gpu-panel');

      this._onLost = (e) => {
        e.preventDefault();
        if (this._dead) return; // our own releaseContext(), not a real loss
        this.lost = true;
        this.onLost?.(this);
      };
      this._onRestored = () => {
        if (this._dead) return;
        this.lost = false;
        this._buildGL();
        this.dirty = true;
      };
      this.canvas.addEventListener('webglcontextlost', this._onLost);
      this.canvas.addEventListener('webglcontextrestored', this._onRestored);

      this._buildGL();
      return true;
    }

    _buildGL() {
      const gl = this.gl;
      deleteGLObjects(gl, this); // re-entrant: context restore rebuilds
      this.tex = null;
      this.texKey = null;
      this.program = linkProgram(gl, PANEL_VS, PANEL_FS);
      this.u = uniformMap(gl, this.program);
      this.aPos = gl.getAttribLocation(this.program, 'aPos');
      this.quad = createUnitQuad(gl);
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }

    /**
     * Upload the shared (downscaled wallpaper) canvas. key avoids reuploads.
     * A canvas source is used on purpose: UNPACK_FLIP_Y_WEBGL is honoured for
     * canvases and ignored for ImageBitmaps, and the shader's Y convention
     * depends on the flip actually happening.
     */
    setSource(source, key) {
      if (!this.gl || this._dead || !source) return;
      if (key === this.texKey && this.tex) return;
      const gl = this.gl;
      if (this.tex) {
        gl.deleteTexture(this.tex);
        this.tex = null;
      }
      try {
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          source,
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        this.tex = tex;
        this.texKey = key;
        this.dirty = true;
      } catch (err) {
        console.warn('Win12 WebGL: blur source rejected:', err && err.message);
        this.texKey = null;
      }
    }

    /**
     * @param {{x:number,y:number,w:number,h:number,bl:number,bt:number,
     *          scaleX:number,scaleY:number}} desc panel geometry: w/h/bl/bt in
     *   LOCAL px, x/y is the border-box origin in SCREEN px.
     */
    update(desc) {
      const s = dpr();
      const padCss =
        desc.shadowBlur * 2 +
        Math.abs(desc.shadowOffset[0]) +
        Math.abs(desc.shadowOffset[1]) +
        4;
      const cw = Math.max(1, Math.round((desc.w + 2 * padCss) * s));
      const ch = Math.max(1, Math.round((desc.h + 2 * padCss) * s));
      // cheap signature: screen x/y matter because the blur is sampled in
      // screen space, everything else is geometry/appearance
      const sig = [
        cw,
        ch,
        desc.x,
        desc.y,
        desc.w,
        desc.h,
        desc.bl,
        desc.bt,
        desc.radius,
        desc.scaleX,
        desc.scaleY,
        desc.opacity,
        desc.blurMix,
        desc.shadowBlur,
        desc.tint.join(','),
        desc.shadowColor.join(','),
        desc.shadowOffset.join(','),
        desc.borderColor.join(','),
        desc.borderWidth,
        padCss,
      ].join('|');
      if (sig === this._sig) return;
      this._sig = sig;
      if (this.canvas.width !== cw || this.canvas.height !== ch) {
        this.canvas.width = cw;
        this.canvas.height = ch;
      }
      // The panel is the canvas' containing block, so the canvas is placed in
      // panel-local px: only its own border plus the shadow margin separate
      // the two boxes. Using the panel's viewport rect here would offset the
      // canvas by the panel position a second time.
      const cs = this.canvas.style;
      const left = -desc.bl - padCss,
        top = -desc.bt - padCss;
      const widthCss = desc.w + 2 * padCss + 'px';
      const heightCss = desc.h + 2 * padCss + 'px';
      if (cs.left !== left + 'px') cs.left = left + 'px';
      if (cs.top !== top + 'px') cs.top = top + 'px';
      if (cs.width !== widthCss) cs.width = widthCss;
      if (cs.height !== heightCss) cs.height = heightCss;
      this.desc = desc;
      this._pad = padCss;
      this.dirty = true;
    }

    render(viewportW, viewportH, sourceSize) {
      if (!this.gl || this.lost || this._dead || !this.dirty || !this.desc)
        return;
      const gl = this.gl;
      const d = this.desc;
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(this.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
      gl.enableVertexAttribArray(this.aPos);
      gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(this.u.uViewport, viewportW, viewportH);
      gl.uniform2f(this.u.uSize, d.w, d.h);
      gl.uniform1f(this.u.uPad, this._pad);
      gl.uniform2f(this.u.uScreenOrigin, d.x, d.y);
      gl.uniform2f(this.u.uScale, d.scaleX, d.scaleY);
      gl.uniform1f(this.u.uRadius, d.radius);
      gl.uniform4fv(this.u.uTint, d.tint);
      // no texture (yet) -> no blur taps, otherwise we would sample an
      // incomplete texture and get black
      gl.uniform1f(this.u.uBlurMix, this.tex ? d.blurMix : 0);
      gl.uniform1f(this.u.uSat, d.sat === undefined ? 1.6 : d.sat);
      gl.uniform1f(this.u.uCon, d.con === undefined ? 0.85 : d.con);
      gl.uniform4fv(this.u.uShadowColor, d.shadowColor);
      gl.uniform2f(this.u.uShadowOffset, d.shadowOffset[0], d.shadowOffset[1]);
      gl.uniform1f(this.u.uShadowBlur, d.shadowBlur);
      gl.uniform4fv(this.u.uBorderColor, d.borderColor);
      gl.uniform1f(this.u.uBorderWidth, d.borderWidth);
      gl.uniform1f(this.u.uOpacity, d.opacity);

      if (this.tex) {
        const cov = coverTransform(
          viewportW,
          viewportH,
          sourceSize[0],
          sourceSize[1],
        );
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.uniform1i(this.u.uWall, 0);
        gl.uniform2f(this.u.uCoverScale, cov.scale[0], cov.scale[1]);
        gl.uniform2f(this.u.uCoverOffset, cov.offset[0], cov.offset[1]);
        // one blur radius expressed as a wallpaper-uv delta, so the blur is
        // the same size on screen whatever the viewport or source is
        gl.uniform2f(
          this.u.uBlurStep,
          (cov.scale[0] * BLUR_RADIUS) / viewportW,
          (cov.scale[1] * BLUR_RADIUS) / viewportH,
        );
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      this.dirty = false;
    }

    destroy() {
      this._dead = true;
      if (this.canvas) {
        if (this._onLost)
          this.canvas.removeEventListener('webglcontextlost', this._onLost);
        if (this._onRestored)
          this.canvas.removeEventListener(
            'webglcontextrestored',
            this._onRestored,
          );
        this.canvas.remove();
      }
      this._onLost = this._onRestored = null;
      deleteGLObjects(this.gl, this);
      releaseContext(this.gl); // free the slot now instead of waiting for GC
      this.el?.classList.remove('gpu-panel');
      this.gl = null;
      this.tex = null;
      this.program = null;
      this.quad = null;
      this.u = null;
      this.el = null;
      this.canvas = null;
    }
  }

  // ---------------------------------------------------- wallpaper source IO

  const Wallpaper = {
    url: null,
    image: null,
    failed: false,

    /**
     * The wallpaper is stored in the --bgul custom property (desktop.css:
     * `body { background: var(--bgul) }`). Reading body's computed background
     * instead always yields `none` while full mode is active, because
     * FULL_CSS strips the body background so it is not painted twice - which
     * used to make the whole wallpaper layer silently fall back to the theme
     * gradient.
     */
    currentURL() {
      const raw = cssVar('--bgul');
      let m = raw && raw.match(/url\(["']?([^"')]+)["']?\)/);
      if (!m) {
        // --bgul can be a gradient; fall back to whatever the body paints
        const bg = getComputedStyle(document.body).backgroundImage;
        m = bg && bg.match(/url\(["']?([^"')]+)["']?\)/);
      }
      if (!m) return null;
      try {
        return new URL(m[1], document.baseURI).href;
      } catch (_) {
        return m[1];
      }
    },

    /** @returns {{changed:boolean}} (image may be null -> gradient fallback) */
    sync(done) {
      const url = this.currentURL();
      if (url === this.url && (this.image || this.failed)) {
        done(this.image, false);
        return;
      }
      this.url = url;
      this.image = null;
      this.failed = !url;
      this.failedSrc = '';
      if (!url) {
        done(null, true);
        return;
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (this.url !== url) return; // a newer wallpaper won the race
        this.image = img;
        this.failed = false;
        done(img, true);
      };
      img.onerror = () => {
        if (this.url !== url) return;
        this.failed = true;
        this.failedSrc = url;
        done(null, true);
      };
      img.src = url;
    },
  };

  /**
   * Shared small canvas that every panel context uploads once. Rebuilt only
   * when the wallpaper image or the theme gradient changes.
   *
   * Deliberately a canvas and not an ImageBitmap: WebGL honours
   * UNPACK_FLIP_Y_WEBGL for canvas sources but ignores it for ImageBitmap
   * ones, and the wallpaper layer and the panels must agree on which end of
   * the texture is "up". Never rejects - any failure lands on the gradient.
   */
  const BlurSource = {
    source: null, // HTMLCanvasElement
    key: '',
    size: [0, 0],
    blank: false, // true when neither the image nor the gradient made it in

    async rebuild(image, colA, colB) {
      let w = 64,
        h = 64,
        hasImage = false;
      if (image) {
        const iw = image.naturalWidth || image.width || 0;
        const ih = image.naturalHeight || image.height || 0;
        if (iw > 0 && ih > 0) {
          const k = Math.min(1, BLUR_SRC_MAX / Math.max(iw, ih));
          w = Math.max(1, Math.round(iw * k));
          h = Math.max(1, Math.round(ih * k));
          hasImage = true;
        }
      }
      const c = document.createElement('canvas');
      const ctx = c.getContext('2d');
      if (hasImage) {
        c.width = w;
        c.height = h;
        try {
          // Draw the source directly. createImageBitmap() used to be tried
          // first for speed, but for an SVG without intrinsic dimensions (the
          // default Win12 wallpapers) Chrome returns a 150x150 bitmap that is
          // FULLY TRANSPARENT instead of throwing, so every panel silently
          // lost its mica and showed the plain tint - invisible in light
          // mode, but in dark mode the dock and windows turned flat grey.
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(image, 0, 0, w, h);
          if (isBlankCanvas(ctx, w, h)) {
            console.warn(
              'Win12 WebGL: wallpaper rasterised to nothing, using gradient',
            );
            hasImage = false;
          }
        } catch (err) {
          console.warn(
            'Win12 WebGL: wallpaper downscale failed:',
            err && err.message,
          );
          hasImage = false;
        }
      }
      if (!hasImage) {
        w = 64;
        h = 64;
        c.width = w;
        c.height = h;
        const rgba = (cc) =>
          `rgba(${cc.map((v) => Math.round(v * 255)).join(',')})`;
        const g = ctx.createLinearGradient(0, 0, w * 0.6, h);
        g.addColorStop(0, rgba(colA));
        g.addColorStop(1, rgba(colB));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      this.source = c;
      this.size = [w, h];
      this.blank = isBlankCanvas(ctx, w, h);
      this.key =
        (Wallpaper.url || 'grad') +
        ':' +
        w +
        'x' +
        h +
        ':' +
        colA.join(',') +
        ':' +
        colB.join(',') +
        (hasImage ? ':img' : ':grad');
    },
  };

  // ------------------------------------------------------- DOM -> scene

  /**
   * Elements whose panel material is GPU-appropriate. webapp windows are
   * excluded: they are opaque iframes and need no blur.
   * priority: higher = first in line for a pool slot.
   */
  const PANEL_RULES = [
    { sel: '#cm.show-begin', kind: 'cm', base: 600 },
    {
      sel: '#start-menu.show-begin, #search-win.show-begin, #widgets.show-begin, #datebox.show-begin, #control.show-begin',
      kind: 'menu',
      base: 500,
    },
    { sel: '#dock-box>.dock', kind: 'dock', base: 400 },
    // windows must beat desktop widgets for pool slots
    { sel: '.window.show-begin:not(.webapp)', kind: 'window', base: 200 },
    { sel: '#desktop-widgets>*:not(.widgets-move)', kind: 'widget', base: 50 },
  ];

  function snapshotPanels() {
    const T = Theme.get();
    const winBorder = parseColor('#6f6f6f30');
    const menuBorder = parseColor('#99999950');
    const moreBlur = T.moreBlur;

    // sat/con mirror the CSS backdrop-filter of each panel kind; without them
    // one global pair left, say, the dock visibly greyer than the DOM version.
    const M = {
      window: {
        shadowBlur: 24,
        shadowOffset: [2, 6],
        borderColor: winBorder,
        borderWidth: 1.5,
        shadowColor: T.shadow,
        sat: 4,
        con: 0.8,
      },
      widget: {
        tint: T.bg50,
        blurMix: 1,
        shadowBlur: 20,
        shadowOffset: [3, 3],
        borderColor: [0, 0, 0, 0],
        borderWidth: 0,
        shadowColor: T.shadow,
        sat: 1.5,
        con: 1,
      },
      dock: {
        tint: T.ctxMenu,
        blurMix: 0.9,
        shadowBlur: 18,
        shadowOffset: [0, 3],
        borderColor: menuBorder,
        borderWidth: 1,
        shadowColor: T.shadow,
        sat: 2,
        con: 1,
      },
      menu: {
        tint: T.bg50,
        blurMix: 1,
        shadowBlur: 22,
        shadowOffset: [3, 4],
        borderColor: menuBorder,
        borderWidth: 1.5,
        shadowColor: T.shadow,
        sat: 4,
        con: 0.8,
      },
      cm: {
        tint: T.ctxMenu,
        blurMix: 0.9,
        shadowBlur: 20,
        shadowOffset: [3, 3],
        borderColor: winBorder,
        borderWidth: 1.5,
        shadowColor: T.shadow,
        sat: 2,
        con: 1,
      },
    };

    const out = [];
    for (const rule of PANEL_RULES) {
      const els = document.querySelectorAll(rule.sel);
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        const opacity = parseFloat(cs.opacity);
        if (!(opacity > 0.01)) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        // generous cull so slide-in menus allocate before entering view
        if (
          r.right < -1200 ||
          r.bottom < -1200 ||
          r.left > window.innerWidth + 1200 ||
          r.top > window.innerHeight + 1200
        )
          continue;

        // Layout size, not the rect: the rect is post-transform while the
        // canvas lives *inside* that transform, so using it would apply the
        // open/close scale twice. The rect is still needed for the screen
        // origin the blur is sampled at.
        const w = el.offsetWidth || r.width;
        const h = el.offsetHeight || r.height;
        if (w < 2 || h < 2) continue;
        let radius = parseFloat(cs.borderTopLeftRadius);
        if (!isFinite(radius)) radius = 0;
        radius = Math.min(radius, w / 2, h / 2);

        const b = M[rule.kind];
        const desc = {
          el,
          kind: rule.kind,
          x: r.left,
          y: r.top,
          w,
          h,
          // panel-local px: the canvas is positioned inside the panel's
          // padding box, so its border has to be subtracted as well
          bl: parseFloat(cs.borderLeftWidth) || 0,
          bt: parseFloat(cs.borderTopWidth) || 0,
          scaleX: r.width / w,
          scaleY: r.height / h,
          radius,
          opacity,
          tint: b.tint,
          blurMix: b.blurMix,
          sat: b.sat,
          con: b.con,
          shadowColor: b.shadowColor,
          shadowOffset: b.shadowOffset,
          shadowBlur: b.shadowBlur,
          borderColor: b.borderColor,
          borderWidth: b.borderWidth,
          priority: rule.base,
        };
        if (rule.kind === 'window') {
          const foc = el.classList.contains('foc');
          desc.tint = foc ? T.bg70 : T.unfoc;
          desc.blurMix = foc ? 1 : moreBlur ? 0.5 : 0;
          if (!foc) {
            desc.shadowBlur = 10;
            desc.shadowOffset = [1, 2];
          }
          desc.priority = rule.base + (parseInt(cs.zIndex, 10) || 0);
        }
        out.push(desc);
      }
    }
    return out;
  }

  function fallbackColors() {
    const T = Theme.get();
    return { colA: T.colA, colB: T.colB };
  }

  // -------------------------------------------------------- panel pool mgr

  class PanelManager {
    /** @param {() => void} onDirty request a frame (so a lost layer can be re-allocated) */
    constructor(onDirty) {
      this.onDirty = onDirty;
      /** @type {Map<Element, PanelLayer>} */
      this.layers = new Map();
      this.limit = POOL_SIZE;
      this._limitUntil = 0; // when a lowered limit may be tried again
      this._hardFails = 0; // shader/build failures, i.e. the device cannot
      this.disabled = false;
    }

    /**
     * The device refused another context, or the layer could not be built.
     * Lower the pool for a while instead of forever - contexts released later
     * must be reusable - and give up entirely after repeated build failures.
     * @param {boolean} hard true when building the layer itself failed
     */
    _degrade(hard) {
      if (hard && ++this._hardFails >= MAX_HARD_FAILS) {
        console.warn(
          'Win12 WebGL: panel layers disabled after repeated build failures',
        );
        this.disabled = true;
        this.destroy();
        return;
      }
      this.limit = Math.max(this.layers.size, 1);
      this._limitUntil = performance.now() + POOL_RETRY_MS;
    }

    /**
     * Reconcile layers against the current scene.
     * @param {Array} descs visible panel descriptors
     * @param {HTMLCanvasElement} source shared blur source
     * @param {string} key source identity
     * @param {number[]} sourceSize source dimensions
     */
    sync(descs, source, key, sourceSize) {
      if (this.disabled) return;
      if (
        this.limit < POOL_SIZE &&
        this._limitUntil &&
        performance.now() > this._limitUntil
      ) {
        this.limit = POOL_SIZE; // retry what the device refused earlier
        this._limitUntil = 0;
      }
      const want = new Set(descs.map((d) => d.el));

      // release layers that disappeared
      for (const [el, layer] of this.layers) {
        if (!want.has(el)) {
          layer.destroy();
          this.layers.delete(el);
        }
      }

      // allocate pool slots, highest priority first
      const sorted = descs.slice().sort((a, b) => b.priority - a.priority);
      for (const d of sorted) {
        if (this.layers.has(d.el)) continue;
        if (this.layers.size >= this.limit) {
          // evict the lowest-priority ACTIVE layer if this one outranks it
          let victim = null,
            victimPri = Infinity;
          for (const [el, layer] of this.layers) {
            const p = layer.desc ? layer.desc.priority : -1;
            if (p < victimPri) {
              victimPri = p;
              victim = el;
            }
          }
          if (victim && d.priority > victimPri) {
            const l = this.layers.get(victim);
            l.destroy();
            this.layers.delete(victim);
          } else {
            d.el.classList.remove('gpu-panel'); // DOM fallback for this panel
            continue;
          }
        }
        const layer = new PanelLayer(d.el);
        layer.onLost = (l) => {
          // context is gone: fully remove this canvas (give the panel back
          // to the DOM) and let the next frame allocate a fresh layer.
          const el = l.el;
          l.destroy();
          this.layers.delete(el);
          this.onDirty();
        };
        let attached = false;
        try {
          attached = layer.attach();
        } catch (err) {
          // shader/context failure for this one panel must not kill all
          console.warn(
            'Win12 WebGL: panel layer failed, using DOM for it:',
            err && err.message,
          );
          layer.destroy();
          this._degrade(true);
          continue;
        }
        if (!attached) {
          layer.destroy();
          this._degrade(false); // device refused another live context
          continue;
        }
        this.layers.set(d.el, layer);
      }

      // push geometry + shared texture, mark dirty
      for (const d of descs) {
        const layer = this.layers.get(d.el);
        if (!layer) continue;
        if (source) layer.setSource(source, key);
        layer.update(d);
      }
    }

    renderAll(viewportW, viewportH, sourceSize) {
      for (const layer of this.layers.values()) {
        layer.render(viewportW, viewportH, sourceSize);
      }
    }

    destroy() {
      for (const layer of this.layers.values()) layer.destroy();
      this.layers.clear();
    }
  }

  // ----------------------------------------------------- change detection

  class SurfaceTracker {
    constructor(onDirty) {
      this.onDirty = onDirty;
      // While a CSS transition is running we must keep polling rects.
      // transitionstart/end are not reliably paired (interrupted transitions
      // can omit end), so use a sliding deadline instead of a counter:
      // every start extends "live" until TRANSITION_GRACE_MS after the last.
      this.liveUntil = 0;
      this._observer = null;
      this._resizeObserver = null;
      this._onStart = null;
      this._onResize = null;
    }

    start() {
      // Our own canvases live inside the observed subtree: inserting them, or
      // resizing them from update(), must not schedule yet another frame.
      const isOurs = (n) =>
        !!(
          n &&
          n.nodeType === 1 &&
          n.classList &&
          (n.classList.contains('win12-gl-panel') ||
            n.classList.contains('win12-gl-bg'))
        );
      this._observer = new MutationObserver((records) => {
        for (const rec of records) {
          if (rec.type === 'attributes' && isOurs(rec.target)) continue;
          if (rec.type === 'childList' && !isOurs(rec.target)) {
            let onlyOurs = rec.addedNodes.length + rec.removedNodes.length > 0;
            for (const n of rec.addedNodes) if (!isOurs(n)) onlyOurs = false;
            for (const n of rec.removedNodes) if (!isOurs(n)) onlyOurs = false;
            if (onlyOurs) continue;
          }
          this.onDirty();
          return;
        }
      });
      this._observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class', 'style'],
        childList: true,
        subtree: true,
      });
      this._observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'style'],
      });
      if (window.ResizeObserver) {
        this._resizeObserver = new ResizeObserver(() => this.onDirty());
        this._resizeObserver.observe(document.body);
      }
      document.addEventListener(
        'transitionstart',
        (this._onStart = () => {
          this.liveUntil = performance.now() + 1200; // Win12 transitions <= 700ms
          this.onDirty();
        }),
        true,
      );
      window.addEventListener(
        'resize',
        (this._onResize = () => this.onDirty()),
      );
    }

    isLive() {
      return performance.now() < this.liveUntil;
    }

    stop() {
      this._observer?.disconnect();
      this._observer = null;
      this._resizeObserver?.disconnect();
      this._resizeObserver = null;
      if (this._onStart)
        document.removeEventListener('transitionstart', this._onStart, true);
      if (this._onResize) window.removeEventListener('resize', this._onResize);
      this.liveUntil = 0;
    }
  }

  // --------------------------------------------------------- full compositor

  const FULL_STYLE_ID = 'win12-webgl-full-style';

  const FULL_CSS = `
    html.webgl-full body { background: none !important; }

    /* Paint stripping applies ONLY to panels that own a live GL layer, and it
       is written generically on purpose: the list of selectors that may get
       the class lives in PANEL_RULES, and a second hand-maintained list here
       would silently drift out of sync with it. */
    html.webgl-full .gpu-panel {
      background: transparent !important;
      background-color: transparent !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      border-color: transparent !important;
      outline-color: transparent !important;
      box-shadow: none !important;
      /* the canvas is z-index:-1 inside the panel, which only paints above the
         panel's own background when the panel is a stacking context */
      isolation: isolate;
    }
    /* the panel canvas spills a shadow margin outside the box; re-clip the
       children to the rounded corners instead of relying on overflow:hidden */
    html.webgl-full .window.gpu-panel { overflow: visible !important; }
    html.webgl-full .window.gpu-panel > .titbar {
      border-top-left-radius: inherit;
      border-top-right-radius: inherit;
    }
    html.webgl-full .window.gpu-panel > .content {
      border-bottom-left-radius: inherit;
      border-bottom-right-radius: inherit;
    }
    /* #cm keeps overflow:hidden (it animates max-height), so its GL shadow is
       clipped - keep the DOM shadow instead of losing it. */
    html.webgl-full #cm.gpu-panel {
      box-shadow: 3px 3px 25px 0px var(--shadow) !important;
    }
    /* these two are static in flow, and the canvas needs them as containing
       block, otherwise it would resolve against #dock-box / #desktop-widgets */
    html.webgl-full #dock-box .dock.gpu-panel,
    html.webgl-full #desktop-widgets > *.gpu-panel {
      position: relative;
    }

    .win12-gl-bg {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      z-index: -1;
      pointer-events: none;
    }
    .win12-gl-panel {
      position: absolute;
      z-index: -1;
      pointer-events: none;
    }
  `;

  /**
   * Tell the shell that WebGL could not deliver, so it can show it in the UI
   * instead of leaving a setting selected that does nothing.
   * @param {string} reason
   */
  function notifyFallback(reason) {
    try {
      window.win12WebGL?.onFallback?.(reason);
    } catch (_) {
      /* ignore */
    }
    try {
      document.dispatchEvent(
        new CustomEvent('win12:webgl-fallback', { detail: { reason } }),
      );
    } catch (_) {
      /* ignore */
    }
  }

  class FullCompositor {
    constructor() {
      this.bg = new WallpaperLayer();
      this.panels = new PanelManager(() => this._markDirty());
      this.tracker = null;
      this.styleEl = null;
      this.active = false;
      this.raf = 0;
      this.needsFrame = false;
      this.sourceKey = '';
      this.frameToken = 0;
      this.lastError = null;
      this.frameErrors = 0;
      this._errTimer = 0;
      this._onVis = null;
    }

    start() {
      if (this.active) return;
      this._teardown(); // clear anything a previous failed start left behind
      if (
        !this.bg.init(
          () => this._bgLost(),
          () => this._bgRestored(),
        )
      )
        throw new Error('no-webgl');

      try {
        this._injectStyles();
        document.documentElement.classList.add('webgl-full');
        document.body.prepend(this.bg.canvas);
        this.bg.resize();

        this.tracker = new SurfaceTracker(() => this._markDirty());
        this.tracker.start();

        this._onVis = () => {
          if (document.hidden) this._cancel();
          else this._markDirty();
        };
        document.addEventListener('visibilitychange', this._onVis);

        this.active = true;
        this.frameErrors = 0;
        this.lastError = null;
        this._markDirty();
      } catch (err) {
        // The injected CSS strips the body background, so a half-started
        // compositor MUST NOT leave it in the document: without this the
        // desktop would lose its wallpaper until the page is reloaded.
        this._teardown();
        throw err;
      }
    }

    _bgLost() {
      // Wallpaper context gone: while body's background is stripped the DOM
      // cannot paint the wallpaper either, so hand painting back to CSS until
      // the browser restores the context (which also un-strips the panels).
      if (this.styleEl) this.styleEl.disabled = true;
      notifyFallback('wallpaper-context-lost');
    }

    _bgRestored() {
      this.bg.setWallpaper(Wallpaper.image);
      if (this.styleEl) this.styleEl.disabled = false;
      this._markDirty();
    }

    _injectStyles() {
      if (this.styleEl) return;
      this.styleEl = document.createElement('style');
      this.styleEl.id = FULL_STYLE_ID;
      this.styleEl.textContent = FULL_CSS;
      document.head.appendChild(this.styleEl);
    }

    resize() {
      if (!this.active) return;
      this.bg.resize();
      this._markDirty();
    }

    render() {
      this._markDirty();
    }

    _markDirty() {
      if (!this.active) return;
      this.needsFrame = true;
      if (!this.raf && !document.hidden) {
        this.raf = requestAnimationFrame(() => this._frame());
      }
    }

    _cancel() {
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = 0;
      this.needsFrame = false;
    }

    async _frame() {
      this.raf = 0;
      if (!this.active) return;
      if (!this.needsFrame && !this.tracker.isLive()) return;
      this.needsFrame = false;
      const token = ++this.frameToken;
      try {
        await this._renderFrame(token);
        this.frameErrors = 0;
      } catch (err) {
        // never let a frame error kill the whole compositor silently
        this.lastError = String(err && (err.stack || err.message || err));
        console.warn('Win12 WebGL: frame error:', err);
        if (++this.frameErrors >= MAX_FRAME_ERRORS) {
          // Persistent failure: give the desktop back to the DOM rather than
          // retrying (and logging) every 500ms for the rest of the session.
          const reason = this.lastError;
          this.stop();
          notifyFallback(reason);
          return;
        }
        this._scheduleAfterError();
      }
      if (this.active && token === this.frameToken && this.tracker.isLive()) {
        this._markDirty();
      }
    }

    _scheduleAfterError() {
      clearTimeout(this._errTimer);
      this._errTimer = setTimeout(() => this._markDirty(), 500);
    }

    async _renderFrame(token) {
      const { colA, colB } = fallbackColors();
      this.bg.resize();

      // 1. wallpaper image -> wallpaper canvas texture (when changed)
      Wallpaper.sync((img, changed) => {
        if (!changed) return;
        this.bg.setWallpaper(img);
        this._markDirty(); // covers async image decode finishing later
      });
      if (this.bg.dirty && this.bg.gl) this.bg.render(colA, colB);

      // 2. shared blur source (rebuilt only on wallpaper/theme change)
      const gradKey = colA.join(',') + '|' + colB.join(',');
      const desiredKey =
        (Wallpaper.image ? 'img:' : 'grad:') +
        (Wallpaper.url || 'grad') +
        '#' +
        gradKey;
      if (desiredKey !== this.sourceKey || !BlurSource.source) {
        this.sourceKey = desiredKey;
        await BlurSource.rebuild(Wallpaper.image, colA, colB);
      }
      // mode may have switched (or a newer frame started) during the await
      if (!this.active || token !== this.frameToken) return;

      // 3. reconcile panel layers with the DOM, draw dirty layers
      const descs = snapshotPanels();
      this.panels.sync(
        descs,
        BlurSource.source,
        BlurSource.key,
        BlurSource.size,
      );
      this.panels.renderAll(
        window.innerWidth,
        window.innerHeight,
        BlurSource.size,
      );
      this.lastError = null;

      if (this.tracker.isLive()) this._markDirty();
    }

    stop() {
      this.active = false;
      this._teardown();
    }

    /**
     * Idempotent cleanup, also used to roll back a start() that threw half way
     * through (see start()). Everything here must tolerate being called on a
     * compositor that never finished starting.
     */
    _teardown() {
      this._cancel();
      clearTimeout(this._errTimer);
      this._errTimer = 0;
      this.tracker?.stop();
      this.tracker = null;
      if (this._onVis) {
        document.removeEventListener('visibilitychange', this._onVis);
        this._onVis = null;
      }
      this.panels.destroy();
      this.styleEl?.remove();
      this.styleEl = null;
      document.documentElement.classList.remove('webgl-full');
      this.bg.destroy();
      Wallpaper.url = null;
      Wallpaper.image = null;
      Wallpaper.failed = false;
      BlurSource.source = null;
      BlurSource.key = '';
      this.sourceKey = '';
      this.frameErrors = 0;
    }
  }

  // ------------------------------------------------------- partial overlay

  class PartialOverlay {
    constructor() {
      this.canvas = null;
      this.gl = null;
      this.program = null;
      this.buffer = null;
      this.raf = 0;
      this.styleEl = null;
      this._resize = null;
      this._onLost = null;
    }

    start() {
      const style = document.createElement('style');
      style.textContent = `
        #win12-webgl-layer {
          position: fixed; inset: 0; width: 100vw; height: 100vh;
          pointer-events: none; z-index: 0; opacity: .3; mix-blend-mode: multiply;
        }`;
      document.head.appendChild(style);
      this.styleEl = style;

      const canvas = document.createElement('canvas');
      canvas.id = 'win12-webgl-layer';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.prepend(canvas);
      const gl =
        canvas.getContext('webgl2', { alpha: true }) ||
        canvas.getContext('webgl', { alpha: true });
      if (!gl) {
        style.remove();
        canvas.remove();
        this.styleEl = null;
        throw new Error('no-webgl');
      }
      this.canvas = canvas;
      this.gl = gl;

      const program = linkProgram(
        gl,
        'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}',
        `precision mediump float;uniform float t;
         void main(){
           vec2 p = gl_FragCoord.xy / vec2(1200.0, 800.0);
           float v = 0.5 + 0.5 * sin(t * 0.00025 + p.x * 3.0 + p.y * 2.0);
           gl_FragColor = vec4(0.05 + 0.08 * v, 0.28 + 0.12 * v, 0.52 + 0.18 * v, 0.12);
         }`,
      );
      this.program = program;
      gl.useProgram(program);
      const buffer = gl.createBuffer();
      this.buffer = buffer;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
      );
      const position = gl.getAttribLocation(program, 'p');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      const time = gl.getUniformLocation(program, 't');

      const resize = () => {
        const s = dpr();
        canvas.width = innerWidth * s;
        canvas.height = innerHeight * s;
        gl.viewport(0, 0, canvas.width, canvas.height);
      };
      window.addEventListener('resize', (this._resize = resize));
      resize();

      const draw = (now) => {
        if (!this.canvas) return;
        gl.uniform1f(time, now);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      };

      // A permanently animating full-screen layer is pure battery drain for
      // what is only a tint: users who ask for less motion get one static
      // frame instead of a rAF loop that never ends.
      const reduceMotion =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) {
        draw(0);
      } else {
        const frame = (now) => {
          if (!this.canvas) return;
          draw(now);
          this.raf = requestAnimationFrame(frame);
        };
        this.raf = requestAnimationFrame(frame);
      }

      this._onLost = (e) => {
        e.preventDefault();
        this.stop();
        notifyFallback('partial-context-lost');
      };
      canvas.addEventListener('webglcontextlost', this._onLost);
      document.documentElement.classList.add('webgl-partial');
    }

    stop() {
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = 0;
      if (this._resize) window.removeEventListener('resize', this._resize);
      this._resize = null;
      if (this.canvas) {
        if (this._onLost)
          this.canvas.removeEventListener('webglcontextlost', this._onLost);
        this.canvas.remove();
      }
      this._onLost = null;
      deleteGLObjects(this.gl, { program: this.program, quad: this.buffer });
      releaseContext(this.gl);
      this.program = null;
      this.buffer = null;
      this.gl = null;
      this.canvas = null;
      this.styleEl?.remove();
      this.styleEl = null;
      document.documentElement.classList.remove('webgl-partial');
    }
  }

  // ------------------------------------------------------------ controller

  function supported() {
    try {
      const probe = document.createElement('canvas');
      return !!(
        probe.getContext('webgl2', { alpha: true }) ||
        probe.getContext('webgl', { alpha: true })
      );
    } catch (_) {
      return false;
    }
  }

  const full = new FullCompositor();
  const partial = new PartialOverlay();
  let currentMode = DEFAULT_MODE;

  function isRunning(mode) {
    if (mode === 'full') return full.active;
    if (mode === 'partial') return !!partial.canvas;
    return !full.active && !partial.canvas;
  }

  function stopAll() {
    full.stop();
    partial.stop();
    document.documentElement.classList.remove(
      'webgl-full',
      'webgl-partial',
      'webgl-fallback',
    );
    currentMode = 'off';
  }

  /**
   * @param {'off'|'partial'|'full'} mode
   * @returns {'off'|'partial'|'full'} the mode that is actually running
   */
  function start(mode) {
    if (!MODES.includes(mode)) mode = DEFAULT_MODE;
    // Re-applying the mode that already runs (the shell asks for it more than
    // once during boot) must not tear the compositor down and rebuild it.
    if (mode === currentMode && isRunning(mode)) return mode;

    stopAll();
    if (mode === 'off') return 'off';
    if (!supported()) {
      document.documentElement.classList.add('webgl-fallback');
      notifyFallback('unsupported');
      return 'off';
    }
    try {
      if (mode === 'full') full.start();
      else partial.start();
      currentMode = mode;
      return mode;
    } catch (err) {
      console.warn(
        'Win12 WebGL: falling back to DOM rendering:',
        err && err.message,
      );
      full.stop();
      partial.stop();
      document.documentElement.classList.add('webgl-fallback');
      currentMode = 'off';
      notifyFallback(err && err.message);
      return 'off';
    }
  }

  window.win12WebGL = {
    /** The persisted preference - may differ from what actually runs. */
    getSavedMode: () => localStorage.getItem(KEY) || DEFAULT_MODE,
    /** The mode that is actually running right now. */
    getMode: () => currentMode,
    /**
     * Persist and apply a mode.
     * @returns {'off'|'partial'|'full'} the mode that actually runs; the
     *   preference is kept even when it could not be enabled, so the UI can
     *   tell the user instead of silently downgrading them.
     */
    apply(mode) {
      mode = MODES.includes(mode) ? mode : DEFAULT_MODE;
      const actual = start(mode);
      try {
        localStorage.setItem(KEY, mode);
      } catch (_) {
        /* private mode */
      }
      return actual;
    },
    setMode(mode) {
      return this.apply(mode);
    },
    start,
    stop: stopAll,
    /** Extra hook for the shell; notifyFallback() also fires a DOM event. */
    onFallback: null,
    resize() {
      if (full.active) full.resize();
    },
    render() {
      if (full.active) full.render();
    },
    destroy() {
      stopAll();
    },
    supported,
    getState() {
      return {
        v: 'layered-4',
        mode: currentMode,
        saved: this.getSavedMode(),
        supported: supported(),
        fallback: document.documentElement.classList.contains('webgl-fallback'),
        layers: full.active ? full.panels.layers.size : 0,
        panelsDisabled: full.panels.disabled,
        poolLimit: full.panels.limit,
        wallpaper: {
          url: Wallpaper.url,
          loaded: !!Wallpaper.image,
          failed: Wallpaper.failed,
          blur: BlurSource.size[0] + 'x' + BlurSource.size[1],
          blurBlank: BlurSource.blank,
          tex: full.bg.texSize[0] + 'x' + full.bg.texSize[1],
        },
        lastError: full.lastError,
      };
    },
    init() {
      return this.apply(this.getSavedMode());
    },
  };

  document.addEventListener('DOMContentLoaded', () => window.win12WebGL.init());
})();
