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
import { _x } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { default as template } from './template';

export default {
  title: _x('Annual Clothing Sale', 'template name', 'web-stories'),
  tags: [
    _x('Single', 'template keyword', 'web-stories'),
    _x('Image', 'template keyword', 'web-stories'),
    _x('Sale', 'template keyword', 'web-stories'),
    _x('Ad', 'template keyword', 'web-stories'),
  ],
  colors: [],
  description: '',
  ...template,
  vertical: _x('Ads', 'template vertical', 'web-stories'),
};
