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
function getStoryAdImageMediaData(file) {
  return new Promise((resolve) => {
    const { name, size, type } = file;
    const src = URL.createObjectURL(file);
    const img = new Image();

    img.onload = function () {
      // Do we also want to URL.revokeObjectURL( src ) to free up memory after image is added to DOM ?

      resolve({
        width: this.width,
        height: this.height,
        name,
        size,
        mimeType: type,
        type: 'image',
        alt: '',
        id: size,
        sizes: {},
        title: name,
        src,
      });
    };

    img.src = src;
  });
}

export default getStoryAdImageMediaData;
