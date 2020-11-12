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
import { __, _x } from '@wordpress/i18n';
import {
  Button,
  ToolbarGroup,
  TextControl,
  PanelBody,
  RangeControl,
  SelectControl,
  ToggleControl,
  BaseControl,
  SVG,
  Path,
} from '@wordpress/components';
import {
  BlockControls,
  InspectorControls,
  BlockAlignmentToolbar,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import AuthorSelection from './authorSelection';

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

const LatestStoriesControls = (props) => {
  const {
    viewType,
    numOfStories,
    numOfColumns,
    orderByValue,
    isShowingTitle,
    isShowingDate,
    isShowingAuthor,
    isShowingViewAll,
    viewAllLinkLabel,
    isShowingStoryPoster,
    setAttributes,
    // carouselSettings,
    authors,
    listViewImageAlignment,
  } = props;

  const orderByOptions = [
    { label: __('Newest to oldest', 'web-stories'), value: '' },
    { label: __('Oldest to newest', 'web-stories'), value: 'old-to-new' },
    {
      label: _x('A -> Z', 'Sorting order', 'web-stories'),
      value: 'alphabetical',
    },
    {
      label: _x('Z -> A', 'Sorting order', 'web-stories'),
      value: 'reverse-alphabetical',
    },
    { label: __('Random Stories', 'web-stories'), value: 'random' },
  ];

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
          <ToggleControl
            className={
              isViewType('circles') || isViewType('list') ? 'is-disabled' : ''
            }
            label={__('Show story cover images', 'web-stories')}
            checked={
              isViewType('circles') || isViewType('list')
                ? true
                : isShowingStoryPoster
            }
            onChange={() => {
              if (!isViewType('circles') && !isViewType('list')) {
                setAttributes({ isShowingStoryPoster: !isShowingStoryPoster });
              }
            }}
          />
          {isViewType('list') && (
            <BaseControl className="latest-stories-settings__image-alignment">
              <BaseControl.VisualLabel>
                {__('Image alignment', 'web-stories')}
              </BaseControl.VisualLabel>
              <BlockAlignmentToolbar
                value={listViewImageAlignment}
                onChange={(value) =>
                  setAttributes({
                    listViewImageAlignment: value,
                  })
                }
                controls={['left', 'right']}
                isCollapsed={false}
              />
            </BaseControl>
          )}
        </PanelBody>
        {/* {isViewType('carousel') && (
          <PanelBody title={__('Carousel settings', 'web-stories')}>
            <ToggleControl
              label={__('Loop stories', 'web-stories')}
              checked={carouselSettings.loop}
              onChange={() => {
                const newCarouselSettings = cloneDeep(carouselSettings);
                newCarouselSettings.loop = !carouselSettings.loop;
                setAttributes({ carouselSettings: newCarouselSettings });
              }}
            />
            <ToggleControl
              label={__('Autoplay', 'web-stories')}
              checked={carouselSettings.autoplay}
              onChange={() => {
                const newCarouselSettings = cloneDeep(carouselSettings);
                newCarouselSettings.autoplay = !carouselSettings.autoplay;
                setAttributes({ carouselSettings: newCarouselSettings });
              }}
            />
            {carouselSettings.autoplay && (
              <RangeControl
                label={__('Delay in seconds', 'web-stories')}
                value={carouselSettings.delay}
                onChange={(newDelay) => {
                  const newCarouselSettings = cloneDeep(carouselSettings);
                  newCarouselSettings.delay = newDelay;
                  setAttributes({ carouselSettings: newCarouselSettings });
                }}
                min={1}
                max={5}
                step={1}
                initialPosition={3}
              />
            )}
          </PanelBody>
        )} */}
        <PanelBody title={__('Sorting & Filtering', 'web-stories')}>
          <RangeControl
            label={__('Number of stories', 'web-stories')}
            value={numOfStories}
            onChange={(updatedNumOfStories) =>
              setAttributes({ numOfStories: updatedNumOfStories })
            }
            min={1}
            max={20}
            step={1}
            initialPosition={5}
          />
          {isViewType('grid') && (
            <RangeControl
              label={__('Number of columns', 'web-stories')}
              value={numOfColumns}
              onChange={(updatedNumOfColumns) =>
                setAttributes({ numOfColumns: updatedNumOfColumns })
              }
              min={1}
              max={4}
              step={1}
              initialPosition={2}
            />
          )}
          <SelectControl
            label={__('Order by', 'web-stories')}
            options={orderByOptions}
            value={orderByValue}
            onChange={(selection) => setAttributes({ orderByValue: selection })}
          />
          <AuthorSelection authors={authors} setAttributes={setAttributes} />
        </PanelBody>
      </InspectorControls>
    </>
  );
};

LatestStoriesControls.propTypes = {
  viewType: PropTypes.string,
  numOfStories: PropTypes.number,
  numOfColumns: PropTypes.number,
  orderByValue: PropTypes.string,
  isShowingTitle: PropTypes.bool,
  isShowingDate: PropTypes.bool,
  isShowingAuthor: PropTypes.bool,
  isShowingViewAll: PropTypes.bool,
  viewAllLinkLabel: PropTypes.string,
  isShowingStoryPoster: PropTypes.bool,
  setAttributes: PropTypes.func.isRequired,
  // carouselSettings: PropTypes.object,
  authors: PropTypes.array,
  listViewImageAlignment: PropTypes.string,
};

export default LatestStoriesControls;
