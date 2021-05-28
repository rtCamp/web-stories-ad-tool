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
export const initIndexDb = (
  files = [],
  action = 'get',
  callback = () => null
) => {
  const DB_NAME = 'google_ad_creation_tool';
  const DB_VERSION = 1;
  const ASSET_OBJECT_STORE = 'assets';

  const filesStorageKey = 'files';

  const request = window.indexedDB.open(DB_NAME, DB_VERSION);

  request.onerror = function () {
    throw new Error(
      'Could not open Indexed DB due to error: ' + this.errorCode
    );
  };

  request.onupgradeneeded = function () {
    // Here we create a new object store called data, and give it an auto-generated key path
    const storage = this.result.createObjectStore(ASSET_OBJECT_STORE, {
      autoIncrement: true,
    });

    // add an object to the "data" objectStore with the key.
    storage.add([], filesStorageKey);
  };

  request.onsuccess = function (event) {
    const database = event.target.result; // store the database for later use

    // now we are going to use some data from our database
    const storage = database
      .transaction(ASSET_OBJECT_STORE, 'readwrite')
      .objectStore(ASSET_OBJECT_STORE);

    const getRequest = storage.get(filesStorageKey);

    getRequest.onsuccess = function () {
      let tempAssets = this.result;

      if ('save' === action) {
        tempAssets = files;
        storage.put(tempAssets, filesStorageKey);
      }

      if ('get' === action) {
        callback(tempAssets);
      }
    };
  };
};
