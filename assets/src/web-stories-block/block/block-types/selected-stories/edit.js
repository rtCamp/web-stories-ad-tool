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
import classNames from 'classnames';
import { ThemeProvider } from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ApiProvider from '../../../../dashboard/app/api/apiProvider';
import { ConfigProvider } from '../../../../dashboard/app/config';
import theme from '../../../../dashboard/theme';
import {
  theme as externalDesignSystemTheme,
  lightMode,
} from '../../../../design-system';
import StoryPlayer from '../../storyPlayer';
import StoriesInspectorControls from '../../storiesInspectorControls';
import StoriesBlockControls from '../../storiesBlockControls';
import EmbedPlaceholder from './embedPlaceholder';
import FetchSelectedStories from './fetchSelectedStories';

const SelectedStoriesEdit = ({
  icon,
  attributes,
  setAttributes,
  isSelected: isEditing,
}) => {
  const {
    blockType,
    stories,
    align,
    viewType,
    numOfColumns,
    isShowingTitle,
    isShowingDate,
    isShowingAuthor,
    isShowingViewAll,
    viewAllLinkLabel,
    imageOnRight,
    isStyleSquared,
  } = attributes;

  const [selectedStories, setSelectedStories] = useState(stories);
  const [selectedStoriesObject, setSelectedStoriesObject] = useState([]);
  const [isFetchingSelectedStories, setIsFetchingSelectedStories] = useState(
    false
  );

  const label = __('Web Stories', 'web-stories');
  const { config } = global.webStoriesBlockSettings;

  const willShowDate = 'circles' === viewType ? false : isShowingDate;
  const willShowAuthor = 'circles' === viewType ? false : isShowingAuthor;
  const viewAllLabel = viewAllLinkLabel
    ? viewAllLinkLabel
    : __('View All Stories', 'web-stories');

  const alignmentClass = classNames({ [`align${align}`]: align });
  const blockClasses = classNames(
    {
      'is-style-default': !isStyleSquared,
      'is-style-squared': isStyleSquared,
    },
    'web-stories',
    { [`is-view-type-${viewType}`]: viewType },
    { [`columns-${numOfColumns}`]: 'grid' === viewType && numOfColumns }
  );

  const activeTheme = {
    DEPRECATED_THEME: theme,
    ...externalDesignSystemTheme,
    colors: lightMode,
  };

  useEffect(() => {
    setAttributes({
      stories: selectedStories,
    });

    if (selectedStories.length && !selectedStoriesObject.length) {
      setIsFetchingSelectedStories(true);
    }
  }, [
    setAttributes,
    selectedStories,
    selectedStoriesObject,
    setIsFetchingSelectedStories,
  ]);

  useEffect(() => {
    if ('circles' !== viewType) {
      setAttributes({
        isShowingTitle: true,
        isShowingAuthor: true,
        isShowingDate: true,
      });
    }

    if ('circles' === viewType) {
      setAttributes({
        isShowingTitle: true,
      });
    }
  }, [viewType, setAttributes]);

  if (isFetchingSelectedStories) {
    return (
      <FetchSelectedStories
        icon={icon}
        label={label}
        selectedStories={selectedStories}
        setSelectedStoriesObject={setSelectedStoriesObject}
        setIsFetchingSelectedStories={setIsFetchingSelectedStories}
      />
    );
  }

  return (
    <>
      <StoriesBlockControls
        blockType={blockType}
        viewType={viewType}
        setAttributes={setAttributes}
      />
      <StoriesInspectorControls
        attributes={attributes}
        setAttributes={setAttributes}
        showFilters={false}
      />
      {selectedStoriesObject && 0 < selectedStoriesObject.length && (
        <div className={alignmentClass}>
          <div className={blockClasses}>
            {selectedStoriesObject.map((story) => {
              let title = '';

              if (story.title.rendered) {
                title =
                  'circles' === viewType && story.title.rendered.length > 45
                    ? `${story.title.rendered.substring(0, 45)}...`
                    : story.title.rendered;
              }

              return (
                <StoryPlayer
                  key={story.id}
                  url={story.link}
                  title={title}
                  date={story.date_gmt}
                  author={story._embedded.author[0].name}
                  poster={story.featured_media_url}
                  imageOnRight={imageOnRight}
                  isShowingAuthor={willShowAuthor}
                  isShowingDate={willShowDate}
                  isShowingTitle={isShowingTitle}
                />
              );
            })}
          </div>
          {isShowingViewAll && (
            <div className="latest-stories__archive-link">{viewAllLabel}</div>
          )}
        </div>
      )}
      <ThemeProvider theme={activeTheme}>
        <ConfigProvider config={config}>
          <ApiProvider>
            <EmbedPlaceholder
              icon={icon}
              label={label}
              selectedStories={selectedStories}
              setSelectedStories={setSelectedStories}
              selectedStoriesObject={selectedStoriesObject}
              setSelectedStoriesObject={setSelectedStoriesObject}
              isEditing={isEditing}
            />
          </ApiProvider>
        </ConfigProvider>
      </ThemeProvider>
    </>
  );
};

SelectedStoriesEdit.propTypes = {
  icon: PropTypes.func,
  attributes: PropTypes.shape({
    blockType: PropTypes.string,
    stories: PropTypes.array,
    align: PropTypes.string,
    viewType: PropTypes.string,
    numOfColumns: PropTypes.number,
    isShowingTitle: PropTypes.bool,
    isShowingDate: PropTypes.bool,
    isShowingAuthor: PropTypes.bool,
    isShowingViewAll: PropTypes.bool,
    viewAllLinkLabel: PropTypes.string,
    imageOnRight: PropTypes.bool,
    isStyleSquared: PropTypes.bool,
  }),
  setAttributes: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};

export default SelectedStoriesEdit;
