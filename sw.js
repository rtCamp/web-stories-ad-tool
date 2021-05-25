/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const cacheName = 'CSv2';

const cachedFiles = [
  '/',
  '/assets/js/*',
  '/assets/css/vendors-edit-story.css',
  '/assets/css/vendors-edit-story-rtl.css',
  '/assets/css/edit-story.css',
  '/assets/css/edit-story-rtl.css',
  '/manifest.json',
  '/favicon.ico',
  'https://fonts.googleapis.com/css?family=Google+Sans%7CGoogle+Sans%3Ab%7CGoogle+Sans%3A500&display=swap&ver=1.7.0-alpha.0',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        return cache.addAll(cachedFiles);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
