// 采集用的最小静态文件服务器（跨平台，替代原先依赖 python3 的实现）。
// 用法：node static-server.mjs <rootDir> <port>
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(process.argv[2] || '.');
const port = Number(process.argv[3] || 8125);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
};

http
  .createServer(async (req, res) => {
    try {
      let p = decodeURIComponent((req.url || '/').split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      const fp = normalize(join(root, p));
      if (!fp.startsWith(root)) {
        res.statusCode = 403;
        res.end('403');
        return;
      }
      const data = await readFile(fp);
      res.setHeader(
        'Content-Type',
        MIME[extname(fp).toLowerCase()] || 'application/octet-stream',
      );
      res.end(data);
    } catch {
      res.statusCode = 404;
      res.end('404');
    }
  })
  .listen(port, '127.0.0.1', () => {
    console.log(`static-server: ${root} -> http://127.0.0.1:${port}`);
  });
