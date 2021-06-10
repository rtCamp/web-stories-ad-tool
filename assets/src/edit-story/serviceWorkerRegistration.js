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
/**
 * External dependencies
 */
import { Workbox } from 'workbox-window';

export default function registerServiceWorker() {
  // Short-circuit if not production.
  if ('production' !== process.env.NODE_ENV) {
    return;
  }

  // Check if the serviceWorker Object exists in the navigator object ( means if browser supports SW )
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('sw.js');

    wb.addEventListener('installed', (event) => {
      /**
       * We have the condition — event.isUpdate because we don’t want to show
       * this message on the very first service worker installation, only on update.
       */
      if (event.isUpdate) {
        if (
          confirm(`New app update is available, would you like to refresh?`)
        ) {
          window.location.reload();
        }
      }
    });
    wb.register();
  }
}
