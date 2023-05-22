// Set a name for the current cache
var cacheName = 'v1'; 

// Default files to always cache
var cacheFiles = [
	'/images/image1.webp',
	'/images/image2.webp',
	'/images/image3.webp',
	'/images/image4.webp',
	'/images/image5.webp',
	'/images/image6.webp',
	'/images/image7.webp',
	'/images/image8.webp',
	'/images/image9.webp',
	'/images/image10.webp',
	'/images/image11.webp',
	'/images/image12.webp',
	'/images/image13.webp',
	'/images/0a2c09b0-0015-41ef-813d-ed1b2cf5c3f5.webp',
	'/images/52d9e6aa-14d3-4ab9-985a-2f8af64a1343.webp',
	'/images/80786c17-b2d4-49d1-a4e4-844096d97849.webp',
	'/images/Flag_of_Norway.webp',
	'/images/Flag_of_Qatar.webp',
	'/images/Flag_of_the_Czech_Republic.webp',
	'/images/Flag_of_the_United_States.webp',
	'/images/germany-flag-icon.webp',
	'/images/icons8-bath-50.webp',
	'/images/icons8-fridge-50.webp',
	'/images/icons8-email-sign-48.webp',
	'/images/icons8-microwave-50.webp',
	'/images/icons8-parking-50.webp',
	'/images/icons8-spa-50.webp',
	'/images/icons8-stove-50.webp',
	'/images/icons8-location.gif',
	'/images/icons8-wifi.gif',
	'/images/icons8-towel-50.webp',
	'/images/icons8-tv-50.webp',
	'/images/nigeria.webp',
	'/images/Saudi_arabia_flag_large.webp',
	'/images/whatsapp.webp',
	// Include paths to other images you want to cache...
];


self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Installed');

    // e.waitUntil Delays the event until the Promise is resolved
    e.waitUntil(

    	// Open the cache
	    caches.open(cacheName).then(function(cache) {

	    	// Add all the default files to the cache
			console.log('[ServiceWorker] Caching cacheFiles');
			return cache.addAll(cacheFiles);
	    })
	); // end e.waitUntil
});


self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activated');

    e.waitUntil(

    	// Get all the cache keys (cacheName)
		caches.keys().then(function(cacheNames) {
			return Promise.all(cacheNames.map(function(thisCacheName) {

				// If a cached item is saved under a previous cacheName
				if (thisCacheName !== cacheName) {

					// Delete that cached file
					console.log('[ServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
					return caches.delete(thisCacheName);
				}
			}));
		})
	); // end e.waitUntil
});


self.addEventListener('fetch', function(e) {
	console.log('[ServiceWorker] Fetch', e.request.url);

	// e.respondWith Responds to the fetch event
	e.respondWith(

		// Check in cache for the request being made
		caches.match(e.request)

			.then(function(response) {

				// If the request is in the cache
				if ( response ) {
					console.log("[ServiceWorker] Found in Cache", e.request.url, response);
					// Return the cached version
					return response;
				}

				// If the request is NOT in the cache, fetch and cache

				var requestClone = e.request.clone();
				fetch(requestClone)
					.then(function(response) {

						if ( !response ) {
							console.log("[ServiceWorker] No response from fetch ")
							return response;
						}

						var responseClone = response.clone();

						//  Open the cache
						caches.open(cacheName).then(function(cache) {

							// Put the fetched response in the cache
							cache.put(e.request, responseClone);
							console.log('[ServiceWorker] New Data Cached', e.request.url);

							// Return the response
							return response;
			        
				        }); // end caches.open

					})
					.catch(function(err) {
						console.log('[ServiceWorker] Error Fetching & Caching New Data', err);
					});


			}) // end caches.match(e.request)
	); // end e.respondWith
});
