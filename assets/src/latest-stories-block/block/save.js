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

/**
 * The block's save function (pure).
 *
 * Represents a cached copy of the block’s content to be shown in case
 * the plugin is disabled.
 *
 * The server-side 'render_callback' is used to override this on page load.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/
 *
 * @return {null|*} Rendered block.
 */
function save() {
  return null;
}

export default save;
