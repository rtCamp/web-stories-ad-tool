/*
 * Copyright 2020 Google LLC
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
// @TODO: Refactor.
const transforms = {
  from: [
    {
      type: 'shortcode',
      tag: 'web_stories_embed',
      attributes: {
        align: {
          type: 'string',
          shortcode: ({ named: { align } }) => {
            return align;
          },
        },
        height: {
          type: 'number',
          shortcode: ({ named: { height } }) => {
            return height;
          },
        },
        poster: {
          type: 'string',
          shortcode: ({ named: { poster } }) => {
            return poster;
          },
        },
        title: {
          type: 'string',
          shortcode: ({ named: { title } }) => {
            return title;
          },
        },
        url: {
          type: 'string',
          shortcode: ({ named: { url } }) => {
            return url;
          },
        },
        width: {
          type: 'number',
          shortcode: ({ named: { width } }) => {
            return width;
          },
        },
      },
    },
  ],
};

export default transforms;