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
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * Wrapper function around renderToStaticMarkup to silence useLayoutEffect errors.
 * Because react-dom/server warns about useLayoutEffect, mot because of any
 * wrongdoing in our code, but mostly because of its own profiler.
 *
 * @see See https://github.com/facebook/react/issues/14927
 *
 * @param {Object} element React element.
 *
 * @return {string} Markup.
 */
function renderToString(element) {
  /* eslint-disable no-console */
  const retval = console.error;

  console.error = function (error, ...rest) {
    if (
      error &&
      !error.startsWith('Warning: useLayoutEffect does nothing on the server')
    ) {
      retval(error, ...rest);
    }
  };
  /* eslint-enable no-console */

  const markup = renderToStaticMarkup(element);

  console.error = retval; // eslint-disable-line no-console

  return markup;
}

export default renderToString;
