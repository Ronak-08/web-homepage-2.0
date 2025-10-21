/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference types="@sveltejs/kit" />
/// <reference types="../.svelte-kit/ambient.d.ts" />

import { build, files, version } from '$service-worker';

const self = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (globalThis.self));

const CORE_CACHE = `core-cache-${version}`;
const IMAGE_CACHE = `image-cache-v1`; 

const ASSETS = [...build, ...files];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CORE_CACHE)
			.then((cache) => cache.addAll(ASSETS))
			.then(() => self.skipWaiting()) 
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((keys) => {
			return Promise.all(
				keys
					.filter((key) => key !== CORE_CACHE && key !== IMAGE_CACHE)
					.map((key) => caches.delete(key))
			);
		})
	);
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET' || event.request.headers.get('range')) return;

	const url = new URL(event.request.url);

	if (ASSETS.includes(url.pathname)) {
		event.respondWith(
			caches.open(CORE_CACHE).then((cache) => cache.match(event.request))
		);
		return;
	}

	if (event.request.destination === 'image' || url.hostname === 'picsum.photos' || url.hostname === 'w.wallhaven.cc') {
		event.respondWith(
			caches.open(IMAGE_CACHE).then(async (cache) => {
				const cachedResponse = await cache.match(event.request);
				const fetchedResponse = fetch(event.request).then((networkResponse) => {
					if (networkResponse.ok) {
						cache.put(event.request, networkResponse.clone());
					}
					return networkResponse;
				});
				return cachedResponse || fetchedResponse;
			})
		);
		return;
	}
	event.respondWith(
		fetch(event.request).catch(async () => {
			const cache = await caches.open(CORE_CACHE);
			return await cache.match(event.request);
		})
	);
});
