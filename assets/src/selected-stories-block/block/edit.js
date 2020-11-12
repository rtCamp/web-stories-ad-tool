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

/**
 * WordPress dependencies
 */
import { __, _x, sprintf } from '@wordpress/i18n';
import { useState, RawHTML } from '@wordpress/element';

/**
 * External dependencies
 */
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import ApiProvider from '../../dashboard/app/api/apiProvider';
import { ConfigProvider } from '../../dashboard/app/config';
import theme from '../../dashboard/theme';
import {
  theme as externalDesignSystemTheme,
  lightMode,
} from '../../design-system';
import StoryPlayer from '../../latest-stories-block/block/storyPlayer';
import EmbedPlaceholder from './embedPlaceholder';
import Controls from './controls';
import { icon } from './';

const SelectedStoriesEdit = ({
  attributes,
  setAttributes,
  isSelected: isEditing,
}) => {
  const {
    align,
    viewType,
    isShowingTitle,
    isShowingDate,
    isShowingAuthor,
    isShowingViewAll,
    viewAllLinkLabel,
    isShowingStoryPoster,
    carouselSettings,
    listViewImageAlignment,
  } = attributes;

  const [selectedStories, setSelectedStories] = useState([]);
  const [selectedStoriesObject, setSelectedStoriesObject] = useState([]);
  const label = __('Selected Web Stories', 'web-stories');
  const { config } = global.webStoriesSelectedBlockSettings;

  const previewLink = wp.data.select('core/editor').getEditedPostPreviewLink();
  const carouselMessage = sprintf(
    '<i><b></b> %1$s <a target="__blank" href="%2$s">%3$s</a> %4$s</i>',
    _x('Note:', 'informational message', 'web-stories'),
    __("Carousel view's functionality will not work in Editor.", 'web-stories'),
    previewLink,
    __('Preview', 'web-stories'),
    __('post to see it in action.', 'web-stories')
  );

  const willShowStoryPoster = 'grid' != viewType ? true : isShowingStoryPoster;
  const willShowDate = 'circles' === viewType ? false : isShowingDate;
  const willShowAuthor = 'circles' === viewType ? false : isShowingAuthor;
  const viewAllLabel = viewAllLinkLabel
    ? viewAllLinkLabel
    : __('View All Stories', 'web-stories');

  const blockClasses = classNames(
    'wp-block-web-stories-latest-stories latest-stories',
    { [`is-view-type-${viewType}`]: viewType },
    { [`align${align}`]: align }
  );
  const blockStyles = {
    gridTemplateColumns: `repeat(2, 1fr)`,
  };

  const activeTheme = {
    DEPRECATED_THEME: theme,
    ...externalDesignSystemTheme,
    colors: lightMode,
  };

  return (
    <>
      <Controls
        viewType={viewType}
        isShowingTitle={isShowingTitle}
        isShowingDate={isShowingDate}
        isShowingAuthor={isShowingAuthor}
        isShowingViewAll={isShowingViewAll}
        viewAllLinkLabel={viewAllLinkLabel}
        isShowingStoryPoster={isShowingStoryPoster}
        carouselSettings={carouselSettings}
        listViewImageAlignment={listViewImageAlignment}
        setAttributes={setAttributes}
      />
      {selectedStoriesObject && 0 < selectedStoriesObject.length && (
        <div>
          <div className={blockClasses} style={blockStyles}>
            {selectedStoriesObject.map((story) => {
              return (
                <StoryPlayer
                  key={story.id}
                  url={story.link}
                  title={story.title}
                  date={story.date_gmt}
                  author={story.originalStoryData._embedded.author[0].name}
                  poster={story.featured_media_url}
                  isShowingStoryPoster={willShowStoryPoster}
                  listViewImageAlignment={listViewImageAlignment}
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
          {'carousel' === viewType && (
            <span className="latest-stories__carousel-message">
              <RawHTML>{carouselMessage}</RawHTML>
            </span>
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
  attributes: PropTypes.shape({
    align: PropTypes.string,
    viewType: PropTypes.string,
    isShowingTitle: PropTypes.bool,
    isShowingDate: PropTypes.bool,
    isShowingAuthor: PropTypes.bool,
    isShowingViewAll: PropTypes.bool,
    viewAllLinkLabel: PropTypes.string,
    isShowingStoryPoster: PropTypes.bool,
    carouselSettings: PropTypes.object,
    listViewImageAlignment: PropTypes.string,
  }),
  setAttributes: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};

export default SelectedStoriesEdit;
