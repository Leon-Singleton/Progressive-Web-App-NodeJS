// Copyright 2016 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

//initialsies the name of the cache in the browser
var dataCacheName = 'Festival-data-cache';
var cacheName = 'Festival-cache';
//decalres the static files to be cached
var filesToCache = [
    '/',
    '/scripts/app.js',
    '/styles/inline.css',
    '/stylesheets/style.css',
    '/styles/bootstrap.min.css',
    '/scripts/index.js',
    '/scripts/idb.js',
    '/scripts/jquery.min.js',
    '/scripts/database.js',
];

/**
 * installation event: it adds all the files to be cached
 */
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});


/**
 * activation of service worker: it removes all cashed files if necessary
 */
self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});


/**
 * this is called every time a file is fetched. This is a middleware, i.e. this method is
 * called every time a page is fetched by the browser
 * there are two main branches:
 * If the pages can be accessed from the network then they are retrieved from there.
 * all the other pages are searched for in the cache. If not found, they are returned
 */
self.addEventListener('fetch', function (event) {
    console.log('[Service Worker] Fetch', event.request.url);
    var dataUrl = '/festival_data';
    //if the request is '/festival_data', post to the server
    if (event.request.url.indexOf(dataUrl) > -1) {
        /*
         * When the request URL contains dataUrl, the app is asking for fresh
         * festival data. In this case, the service worker always goes to the
         * network and then caches the response. This is called the "Cache then
         * network" strategy:
         * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
         */
        return fetch(event.request).then(function (response) {
            // note: it the network is down, response will contain the error
            // that will be passed to Ajax
            return response;
        }).catch (function(e){
            console.log("service worker error 1: " + e.message);
        })
    } else {

        /*
         * The app is asking for app shell files. In this scenario the app uses the
         * "network, then cache if network not available
         * see Network falling back to cache at
         * https://jakearchibald.com/2014/offline-cookbook/
         */

        //service worker technique which uses the network to retrieve
        //data first before falling back to the cache if the network is unavailable
        event.respondWith(async function() {
            try {
                return await fetch(event.request);
            } catch (err) {
                return caches.match(event.request);
            }
        }());

    }
});


