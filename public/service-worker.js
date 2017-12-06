this.addEventListener('install', event => {
  event.waitUntil(
    caches.open('assets-v2')
      .then(cache => cache.addAll([
        '/index.html',
        '/assets/arrow-hover.svg',
        '/assets/arrow.svg',
        '/assets/delete-hover.svg',
        '/assets/delete.svg',
        '/assets/padlock.svg',
        '/assets/padlock-active.svg',
        '/assets/trash-hover.svg',
        '/assets/trash.svg',
        '/css/colorpalette.css',
        '/css/colors.css',
        '/css/controls.css',
        '/css/projects.css',
        '/css/styles.css',
        '/js/index.js'
      ])  //end cache.addAll
      ) //end of .then
  ); // end wait until
});

this.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );//end of respondWith
});

this.addEventListener('activate', event => {
  let cachesWhiteList = ['assets-v2'];
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(key => {
        if (cachesWhiteList.indexOf(key === -1)) {
          return caches.delete(key);
        }
      })))
  );
});
