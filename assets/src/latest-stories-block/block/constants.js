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
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/components';

/**
 * Block controls icons.
 */
export const GRID_VIEW_TYPE_ICON = 'screenoptions';
export const LIST_VIEW_TYPE_ICON = 'editor-justify';
export const CIRCLES_VIEW_TYPE_ICON = 'marker';
export const CAROUSEL_VIEW_TYPE_ICON = (
  /* From https://material.io/tools/icons */
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path d="M7 19h10V4H7v15zm-5-2h4V6H2v11zM18 6v11h4V6h-4z" />
  </SVG>
);

/**
 * Debounce duration constants.
 */
export const FETCH_AUTHORS_DEBOUNCE = 500;
export const FETCH_STORIES_DEBOUNCE = 1000;
