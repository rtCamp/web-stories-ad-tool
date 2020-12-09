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
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, ToolbarGroup } from '@wordpress/components';
import { BlockControls } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
  GRID_VIEW_TYPE_ICON,
  LIST_VIEW_TYPE_ICON,
  CIRCLES_VIEW_TYPE_ICON,
  CAROUSEL_VIEW_TYPE_ICON,
} from './constants';
import BlockTypeSwitcher from './blockTypeSwitcher';

/**
 * StoriesBlockControls props.
 *
 * @typedef StoriesBlockControlsProps
 *
 * @property {string}    viewType     String indicator of active view type.
 * @property {()=>void} setAttributes Callable function for saving attribute values.
 */

/**
 * LatestStoriesBlockControls component. Used for rendering block controls of the block.
 *
 * @param {StoriesBlockControlsProps} props Component props.
 *
 * @return {*} JSX markup.
 */
const StoriesBlockControls = ({ blockType, viewType, setAttributes }) => {
  /**
   * Toggles a view type.
   *
   * @param {string} newViewType New view type to switch to.
   * @return {void}
   */
  const toggleView = (newViewType) => {
    if ('string' === typeof newViewType) {
      setAttributes({ viewType: newViewType });
    }
  };

  return (
    <BlockControls>
      <ToolbarGroup>
        {blockType && 'url' !== blockType && (
          <Fragment>
            <Button
              label={__('Grid view', 'web-stories')}
              icon={GRID_VIEW_TYPE_ICON}
              onClick={() => {
                toggleView('grid');
              }}
              isPressed={'grid' === viewType}
            />
            <Button
              label={__('List view', 'web-stories')}
              icon={LIST_VIEW_TYPE_ICON}
              onClick={() => {
                toggleView('list');
              }}
              isPressed={'list' === viewType}
            />
            <Button
              label={__('Circles view', 'web-stories')}
              icon={CIRCLES_VIEW_TYPE_ICON}
              onClick={() => {
                toggleView('circles');
              }}
              isPressed={'circles' === viewType}
            />
            <Button
              label={__('Carousel View', 'web-stories')}
              icon={CAROUSEL_VIEW_TYPE_ICON}
              onClick={() => {
                toggleView('carousel');
              }}
              isPressed={'carousel' === viewType}
            />
          </Fragment>
        )}
        <BlockTypeSwitcher
          selectedBlockType={blockType}
          setAttributes={setAttributes}
        />
      </ToolbarGroup>
    </BlockControls>
  );
};

StoriesBlockControls.propTypes = {
  blockType: PropTypes.string.isRequired,
  viewType: PropTypes.string.isRequired,
  setAttributes: PropTypes.func.isRequired,
};

export default StoriesBlockControls;
