let dymanic = [
  'api.github.com',
  'szyinnovationstudio.github.io/550WOS',
  'assets.msn.cn',
];
this.addEventListener('fetch', function (event) {
  if (!/^https?:$/.test(new URL(event.request.url).protocol)) return;
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((res) => {
      let fl = false;
      dymanic.forEach((d) => {
        if (event.request.url.indexOf(d) > 0) {
          fl = true;
          return;
        }
      });
      if (fl) {
        console.log('动态请求', event.request.url);
        return fetch(event.request);
      }
      return res && res.ok
        ? res
        : fetch(event.request)
            .then((responese) => {
              if (!responese.ok) return responese;
              const responeseClone = responese.clone();
              return caches
                .open('550wos')
                .then((cache) => {
                  console.log('下载数据', responeseClone.url);
                  return cache.put(event.request, responeseClone);
                })
                .catch((err) => {
                  console.log(err);
                })
                .then(() => responese);
            })
            .catch((err) => {
              console.log(err);
              throw err;
            });
    }),
  );
});
// 缓存清单变更（例如 PWA 清单与图标）时，改动本文件即可让客户端更新 SW：
// activate 会清掉所有非保护项，下次请求重新从网络拉取。
const cacheNames = ['550wos'];
// 更新缓存时需要保留的大体积静态资源（很少变动，重下代价高）。
//
// 原实现有两个 bug，导致这五项里有四项**照样被删**：
//   1. 写死了 /win12/ 前缀。GitHub Pages 部署在 /win12/ 下，但 wrangler.jsonc 把整个仓库
//      挂在 Worker 根路径，index.html 也指向组织根域 —— 那些部署下五项全部匹配不上，
//      于是每次 activate 都会清空整个缓存（img/ 2.8MB + fonts/ 344KB + jQuery + 图标字体）。
//   2. 匹配用的是 RegExp(前缀 + '\\S+')，要求前缀**后面还得有字符**。
//      对 jq.min.js、bootstrap-icons.css 这两个精确文件名而言，后面什么都没有，
//      所以即使在 /win12/ 部署下也永远匹配不上。
//
// 改为按路径片段匹配，与部署基路径无关。
let nochanges = [
  '/fonts/',
  '/img/',
  '/apps/icons/',
  '/scripts/jq.min.js',
  '/bootstrap-icons.css',
];

/** 该 URL 是否属于「更新时保留」的资源 */
function isProtected(url) {
  let pathname;
  try {
    pathname = new URL(url).pathname;
  } catch (e) {
    return false;
  }
  return nochanges.some(function (seg) {
    return pathname.indexOf(seg) !== -1;
  });
}
let flag = false;

function update(force = false) {
  return caches.keys().then((keys) => {
    if (!keys.includes('550wos')) return;
    return caches.open('550wos').then((cc) => {
      return cc.keys().then((keys) => {
        return Promise.all(
          keys.map((k) => {
            if (force || !isProtected(k.url)) {
              console.log('删除数据', k.url);
              return cc.delete(k);
            }
          }),
        );
      });
    });
  });
}

this.addEventListener('message', function (e) {
  if (e.data && e.data.head == 'update') {
    const updating = update(Boolean(e.data.force));
    if (typeof e.waitUntil == 'function') e.waitUntil(updating);
  }
});
this.addEventListener('activate', function (event) {
  event.waitUntil(update(false));
});
