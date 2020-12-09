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
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import StoriesBlockControls from './storiesBlockControls';

/**
 * Filter 'web-stories-embed' block's block controls to add block switcher.
 *
 * Since we are using the same edit component as 'web-stories-embed' block, we need to
 * filter the controls when the edit component is used as in 'web-stories-list' block.
 * This adds the block switcher control in the toolbar.
 *
 * @type {WPComponent}
 */
const withBlockControls = createHigherOrderComponent((BlockEdit) => {
  const blockControlsElement = (props) => {
    const {
      attributes: { blockType, viewType },
      setAttributes,
      name,
    } = props;

    // Do not add block tramnsform controls if not 'web-stories-list' block.
    if ('web-stories/stories-list' !== name || 'url' !== blockType) {
      return <BlockEdit {...props} />;
    }

    blockControlsElement.propTypes = {
      attributes: PropTypes.shape({
        blockType: PropTypes.string,
        viewType: PropTypes.string,
      }),
      setAttributes: PropTypes.func,
      name: PropTypes.string,
    };

    return (
      <Fragment>
        <BlockEdit {...props} />
        <StoriesBlockControls
          blockType={blockType}
          viewType={viewType}
          setAttributes={setAttributes}
        />
      </Fragment>
    );
  };

  return blockControlsElement;
}, 'withBlockControls');

withBlockControls.propTypes = {
  Component: PropTypes.func,
};

wp.hooks.addFilter(
  'editor.BlockEdit',
  'my-plugin/with-inspector-controls',
  withBlockControls
);
