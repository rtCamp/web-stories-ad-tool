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
import PropTypes from 'prop-types';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { FOCUSABLE_SELECTORS } from '../../constants';

export const KEYS = {
  ADD_BACKGROUND_MEDIA: 'addBackgroundMedia',
  CROP_SELECTED_ELEMENTS: 'cropSelectedElements',
  CROP_ELEMENTS_WITH_SHAPES: 'cropElementsWithShapes',
  SAFE_ZONE: 'safeZone',
  PREVIEW_STORY: 'previewStory',
  ADD_LINKS: 'addLinks',
  ENABLE_SWIPE: 'enableSwipe',
  EMBED_WEB_STORIES: 'embedWebStories',
  DONE: 'done',
};

export const TIPS = {
  [KEYS.ADD_BACKGROUND_MEDIA]: {
    title: __('Add background media', 'web-stories'),
    figureSrc: 'images/help-center/add_bg_module_1',
    description: [
      __(
        'Double click any image or video to enter edit mode. To scale, use the slider. To change the focal point, drag the image or video.',
        'web-stories'
      ),
    ],
  },
  [KEYS.CROP_SELECTED_ELEMENTS]: {
    title: __('Crop selected element', 'web-stories'),
    figureSrc: 'images/help-center/media_edit_mode_module_2',
    description: [
      __(
        'Double click any image or video element to enter edit mode. Then, use the slider to scale the element or move its focal point by dragging it.',
        'web-stories'
      ),
    ],
  },
  [KEYS.CROP_ELEMENTS_WITH_SHAPES]: {
    title: __('Crop elements using shapes', 'web-stories'),
    figureSrc: 'images/help-center/media_bg_shape_module_3',
    description: [
      __(
        'Select a shape from the Shape menu to create a frame.',
        'web-stories'
      ),
    ],
  },
  [KEYS.SAFE_ZONE]: {
    title: __('Stay within the safe zone', 'web-stories'),
    figureSrc: 'images/help-center/safe_zone_module_4',
    description: [
      __(
        'Elements work best when you keep them within the safe zone. Outside of the safe zone, elements like links and buttons may get cropped out or not function properly.',
        'web-stories'
      ),
    ],
  },
};

export const DONE_TIP_ENTRY = [
  KEYS.DONE,
  {
    title: __('Done!', 'web-stories'),
    description: [
      __(
        'You’re caught up with quick tips. We’ll notify you when we add new tips, but feel free to come back whenever you need help.',
        'web-stories'
      ),
    ],
  },
];

export const GUTTER_WIDTH = 24;

export const TRANSITION_DURATION = 500;

export const Z_INDEX = {
  MENU: 1,
  QUICK_TIP: 2,
};

export const BASE_NAVIGATION_FLOW = Object.keys(TIPS);

export const POPUP_ID = 'help_center_companion';
export const FOCUSABLE_POPUP_CHILDREN_SELECTOR = FOCUSABLE_SELECTORS.map(
  (selector) => `#${POPUP_ID} ${selector}`
).join(', ');

export const ReadTipsType = PropTypes.shape({
  ...Object.keys(TIPS).reduce(
    (accum, tipKey) => ({
      ...accum,
      [tipKey]: PropTypes.bool,
    }),
    {}
  ),
});

export const TIP_KEYS_MAP = Object.keys(TIPS).reduce((keyMap, key) => {
  keyMap[key] = true;
  return keyMap;
}, {});
