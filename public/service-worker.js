this.addEventListener('install', event => { //this in this file will always ref service worker cana also use 'self'
  event.waitUntil(
    caches.open('assets-v1').then(cache => {
      return cache.addAll([
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
      ]);//end cacheaddAll
    })//end .then()
  );//end waitUntil
});

this.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );// end respondWith
});

this.addEventListener('activate', event => {
  var cacheWhitelist = ['assets-v1'];
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});
