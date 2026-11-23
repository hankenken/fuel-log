const C='fuel-v023-1';
const ASSETS=['./','index.html','app.js?v=0.2.3','seed.js','manifest.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS.map(p=>new Request(p,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('fuel-')&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin||!u.pathname.startsWith(new URL(self.registration.scope).pathname))return;
if(u.searchParams.has('versionCheck')){e.respondWith(fetch(e.request,{cache:'no-store'}));return;}
e.respondWith((async()=>{try{const r=await fetch(e.request,{cache:'no-store'});if(r.ok&&ASSETS.some(p=>new URL(p,self.registration.scope).href===u.href)){const c=await caches.open(C);await c.put(e.request,r.clone()).catch(()=>{});}return r;}catch(err){const c=await caches.open(C);return await c.match(e.request)||(e.request.mode==='navigate'?await c.match('index.html'):null)||Response.error();}})());});
