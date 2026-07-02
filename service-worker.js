// 曲線整正 移動量算出システム - Service Worker
// アプリ本体・アイコン・マニフェストをキャッシュし、オフラインでも起動できるようにする

const CACHE_NAME = 'kyokusen-seisei-cache-v1';
const APP_SHELL = [
	'./曲線整正_完成版.html',
	'./manifest.json',
	'./icon-192.png',
	'./icon-512.png',
	'./icon-192-maskable.png',
	'./icon-512-maskable.png'
];

// インストール時：アプリ本体一式を事前キャッシュする
self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			return cache.addAll(APP_SHELL);
		})
	);
	self.skipWaiting();
});

// 有効化時：古いバージョンのキャッシュを削除する
self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches.keys().then(function (keys) {
			return Promise.all(
				keys.filter(function (key) { return key !== CACHE_NAME; })
					.map(function (key) { return caches.delete(key); })
			);
		})
	);
	self.clients.claim();
});

// リクエスト時：キャッシュ優先で返し、なければネットワークから取得する（オフライン対応）
self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request).then(function (cached) {
			return cached || fetch(event.request);
		})
	);
});
