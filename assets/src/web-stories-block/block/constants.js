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
import { __ } from '@wordpress/i18n';
import { postList, plusCircle, link } from '@wordpress/icons';

/**
 * Block types
 */
export const BLOCK_TYPE_LATEST_STORIES = 'latest-stories';
export const BLOCK_TYPE_SELECTED_STORIES = 'selected-stories';
export const BLOCK_TYPE_URL = 'url';
export const BLOCK_TYPES = [
  {
    id: BLOCK_TYPE_LATEST_STORIES,
    label: __('Latest Stories', 'web-stories'),
    description: __('Embed latest web stories.', 'web-stories'),
    icon: postList,
  },
  {
    id: BLOCK_TYPE_SELECTED_STORIES,
    label: __('Selected Stories', 'web-stories'),
    description: __('Manually select web stories.', 'web-stories'),
    icon: plusCircle,
  },
  {
    id: BLOCK_TYPE_URL,
    label: __('Story URL', 'web-stories'),
    description: __('Embed a visual story.', 'web-stories'),
    icon: link,
  },
];

/**
 * Block controls icons.
 */
export const GRID_VIEW_TYPE = 'grid';
export const GRID_VIEW_TYPE_ICON = 'screenoptions';
export const LIST_VIEW_TYPE = 'list';
export const LIST_VIEW_TYPE_ICON = 'editor-justify';
export const CIRCLES_VIEW_TYPE = 'circles';
export const CIRCLES_VIEW_TYPE_ICON = 'marker';
export const CAROUSEL_VIEW_TYPE = 'carousel';
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
export const VIEW_TYPES = [
  {
    id: GRID_VIEW_TYPE,
    label: __('Grid View', 'web-stories'),
    icon: GRID_VIEW_TYPE_ICON,
  },
  {
    id: LIST_VIEW_TYPE,
    label: __('List View', 'web-stories'),
    icon: LIST_VIEW_TYPE_ICON,
  },
  {
    id: CIRCLES_VIEW_TYPE,
    label: __('Circle View', 'web-stories'),
    icon: CIRCLES_VIEW_TYPE_ICON,
  },
  {
    id: CAROUSEL_VIEW_TYPE,
    label: __('Carousel View', 'web-stories'),
    icon: CAROUSEL_VIEW_TYPE_ICON,
  },
];

/**
 * Stories 'order-by' values.
 */
export const ORDER_BY_OPTIONS = {
  date: {
    label: __('Newest to oldest', 'web-stories'),
    order: 'desc',
    orderBy: 'date',
  },
  'old-to-new': {
    label: __('Oldest to newest', 'web-stories'),
    order: 'asc',
    orderBy: 'date',
  },
  alphabetical: {
    label: __('A -> Z', 'web-stories'),
    order: 'asc',
    orderBy: 'title',
  },
  'reverse-alphabetical': {
    label: __('Z -> A', 'web-stories'),
    order: 'desc',
    orderBy: 'title',
  },
  random: {
    label: __('Random Stories', 'web-stories'),
    order: 'desc',
    orderBy: 'rand',
  },
};

/**
 * Debounce duration constants.
 */
export const FETCH_AUTHORS_DEBOUNCE = 500;
export const FETCH_STORIES_DEBOUNCE = 1000;
