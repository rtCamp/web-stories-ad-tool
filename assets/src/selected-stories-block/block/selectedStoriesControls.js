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
import {
  Button,
  ToolbarGroup,
  TextControl,
  PanelBody,
  ToggleControl,
  SVG,
  Path,
} from '@wordpress/components';
import { BlockControls, InspectorControls } from '@wordpress/block-editor';

/* From https://material.io/tools/icons */
const carouselIcon = (
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

const SelectedStoriesControls = (props) => {
  const {
    viewType,
    isShowingTitle,
    isShowingDate,
    isShowingAuthor,
    isShowingViewAll,
    viewAllLinkLabel,
    isShowingStoryPoster,
    setAttributes,
    // carouselSettings,
    imageOnRight,
  } = props;

  const toggleView = (newViewType) => {
    if (newViewType) {
      setAttributes({ viewType: newViewType });
    }
  };

  const isViewType = (newViewType) => {
    if (!viewType || !newViewType) {
      return false;
    }

    if (newViewType === viewType) {
      return true;
    }

    return false;
  };

  return (
    <>
      <BlockControls>
        <ToolbarGroup>
          <Button
            className="components-toolbar__control"
            label={__('Grid view', 'web-stories')}
            icon="screenoptions"
            onClick={() => {
              toggleView('grid');
            }}
            isPressed={isViewType('grid')}
          />
          <Button
            className="components-toolbar__control"
            label={__('List view', 'web-stories')}
            icon="editor-justify"
            onClick={() => {
              toggleView('list');
            }}
            isPressed={isViewType('list')}
          />
          <Button
            className="components-toolbar__control"
            label={__('Circles view', 'web-stories')}
            icon="marker"
            onClick={() => {
              toggleView('circles');
            }}
            isPressed={isViewType('circles')}
          />
          <Button
            className="components-toolbar__control"
            label={__('Carousel View', 'web-stories')}
            icon={carouselIcon}
            onClick={() => {
              toggleView('carousel');
            }}
            isPressed={isViewType('carousel')}
          />
        </ToolbarGroup>
      </BlockControls>
      <InspectorControls>
        <PanelBody
          className="latest-stories-settings"
          title={__('Story settings', 'web-stories')}
        >
          <ToggleControl
            className={!isViewType('grid') ? 'is-disabled' : ''}
            label={__('Show story cover images', 'web-stories')}
            checked={!isViewType('grid') ? true : isShowingStoryPoster}
            onChange={() => {
              if (isViewType('grid')) {
                setAttributes({ isShowingStoryPoster: !isShowingStoryPoster });
              }
            }}
          />
          <ToggleControl
            label={__('Show title', 'web-stories')}
            checked={isShowingTitle}
            onChange={() => setAttributes({ isShowingTitle: !isShowingTitle })}
          />
          <ToggleControl
            className={isViewType('circles') ? 'is-disabled' : ''}
            label={__('Show date', 'web-stories')}
            checked={isViewType('circles') ? false : isShowingDate}
            onChange={() => {
              if (!isViewType('circles')) {
                setAttributes({ isShowingDate: !isShowingDate });
              }
            }}
          />
          <ToggleControl
            className={isViewType('circles') ? 'is-disabled' : ''}
            label={__('Show author', 'web-stories')}
            checked={isViewType('circles') ? false : isShowingAuthor}
            onChange={() => {
              if (!isViewType('circles')) {
                setAttributes({ isShowingAuthor: !isShowingAuthor });
              }
            }}
          />
          {isViewType('list') && (
            <ToggleControl
              label={__('Show image on right', 'web-stories')}
              checked={imageOnRight}
              onChange={() => {
                setAttributes({ imageOnRight: !imageOnRight });
              }}
            />
          )}
          <ToggleControl
            label={__("Show 'View All Stories' link", 'web-stories')}
            checked={isShowingViewAll}
            onChange={() =>
              setAttributes({ isShowingViewAll: !isShowingViewAll })
            }
          />
          {isShowingViewAll && (
            <TextControl
              label={__("'View All Stories' Link label", 'web-stories')}
              value={viewAllLinkLabel}
              placeholder={__('View All Stories', 'web-stories')}
              onChange={(newLabel) =>
                setAttributes({ viewAllLinkLabel: newLabel })
              }
            />
          )}
        </PanelBody>
      </InspectorControls>
    </>
  );
};

SelectedStoriesControls.propTypes = {
  viewType: PropTypes.string,
  isShowingTitle: PropTypes.bool,
  isShowingDate: PropTypes.bool,
  isShowingAuthor: PropTypes.bool,
  isShowingViewAll: PropTypes.bool,
  viewAllLinkLabel: PropTypes.string,
  isShowingStoryPoster: PropTypes.bool,
  setAttributes: PropTypes.func.isRequired,
  // carouselSettings: PropTypes.object,
  imageOnRight: PropTypes.bool,
};

export default SelectedStoriesControls;
