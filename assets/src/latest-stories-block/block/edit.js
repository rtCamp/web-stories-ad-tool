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
import { useEffect, useState, RawHTML } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __, _x, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import StoryPlayer from './storyPlayer';
import LatestStoriesControls from './latestStoriesControls';

import './edit.css';

const LatestStoriesEdit = ({ attributes, setAttributes }) => {
  const {
    align,
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
    carouselSettings,
    authors,
    listViewImageAlignment,
  } = attributes;

  const [fetchedStories, setFetchedStories] = useState([]);
  const [fetchedAuthors, setFetchedAuthors] = useState([]);
  const previewLink = wp.data.select( 'core/editor' ).getEditedPostPreviewLink();
  const carouselMessage = sprintf(`<i><b>%s</b> %s <a target="__blank" href=${previewLink}>%s</a> %s</i>`, // @TODO: Fix: sprintf must be called with a valid format string.
    _x('Note:', 'informational message', 'web-stories'),
    __("Carousel view's functionality will not work in Editor.", 'web-stories'),
    __('Preview', 'web-stories'),
    __('post to see it in action.', 'web-stories')
  );

  useEffect(() => {
    apiFetch({
      path: addQueryArgs('/wp/v2/users', { per_page: -1 }),
    })
      .then((data) => {
        setFetchedAuthors(data);
      })
      .catch(() => {
        setFetchedAuthors([]);
      });
  }, [fetchedStories]);

  useEffect(() => {
    let order,
      orderBy = '';

    switch (orderByValue) {
      case 'old-to-new':
        orderBy = 'date';
        order = 'asc';
        break;
      case 'alphabetical':
        orderBy = 'title';
        order = 'asc';
        break;
      case 'reverse-alphabetical':
        orderBy = 'title';
        order = 'desc';
        break;
      case 'random':
        orderBy = 'rand';
        order = 'desc';
        break;
      default:
        orderBy = 'date';
        order = 'desc';
    }

    const latestStoriesQuery = {
      author: authors.map((author) => author.id),
      order,
      orderby: orderBy,
      per_page: numOfStories,
    };

    apiFetch({
      path: addQueryArgs('/web-stories/v1/web-story', latestStoriesQuery),
    })
      .then((stories) => {
        setFetchedStories(stories);
      })
      .catch((err) => {
        // Temporarily disabled, show a UI message.
        // eslint-disable-next-line no-console
        console.log(err);
      });
  }, [authors, numOfStories, orderByValue]);

  const willShowStoryPoster =
    ( 'grid' != viewType ) ? true : isShowingStoryPoster;
  const willShowDate = 'circles' === viewType ? false : isShowingDate;
  const willShowAuthor = 'circles' === viewType ? false : isShowingAuthor;
  const viewAllLabel = viewAllLinkLabel
    ? viewAllLinkLabel
    : __('View All Stories', 'web-stories');

  const storiesToDisplay =
    fetchedStories.length > numOfStories
      ? fetchedStories.slice(0, numOfStories)
      : fetchedStories;

  const blockClasses = classNames(
    'wp-block-web-stories-latest-stories latest-stories',
    { [`is-view-type-${viewType}`]: viewType },
    { [`align${align}`]: align }
  );
  const blockStyles = {
    gridTemplateColumns: `repeat(${numOfColumns}, 1fr)`,
  };

  return (
    <>
      <LatestStoriesControls
        viewType={viewType}
        numOfStories={numOfStories}
        numOfColumns={numOfColumns}
        orderByValue={orderByValue}
        isShowingTitle={isShowingTitle}
        isShowingDate={isShowingDate}
        isShowingAuthor={isShowingAuthor}
        isShowingViewAll={isShowingViewAll}
        viewAllLinkLabel={viewAllLinkLabel}
        isShowingStoryPoster={isShowingStoryPoster}
        carouselSettings={carouselSettings}
        authors={authors}
        listViewImageAlignment={listViewImageAlignment}
        setAttributes={setAttributes}
      />
      {storiesToDisplay && 0 < storiesToDisplay.length && (
        <div>
          <div className={blockClasses} style={blockStyles}>
            {storiesToDisplay.map((story) => {
              const author = fetchedAuthors.find(
                (singleAuthorObj) => story.author === singleAuthorObj.id
              );
              let title = '';

              if ( story.title.rendered ) {
                title = ('circles' === viewType && story.title.rendered.length > 45) ?
                  `${story.title.rendered.substring(0, 45)}...` :
                  story.title.rendered;
              }

              return (
                <StoryPlayer
                  key={story.id}
                  url={story.link}
                  title={title}
                  date={story.date_gmt}
                  author={author ? author.name : ''}
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
    </>
  );
};

LatestStoriesEdit.propTypes = {
  attributes: PropTypes.shape({
    align: PropTypes.string,
    viewType: PropTypes.string,
    numOfStories: PropTypes.number,
    numOfColumns: PropTypes.number,
    orderByValue: PropTypes.string,
    isShowingTitle: PropTypes.bool,
    isShowingDate: PropTypes.bool,
    isShowingAuthor: PropTypes.bool,
    isShowingViewAll: PropTypes.bool,
    viewAllLinkLabel: PropTypes.bool,
    isShowingStoryPoster: PropTypes.bool,
    carouselSettings: PropTypes.object,
    authors: PropTypes.array,
    listViewImageAlignment: PropTypes.string,
  }),
  setAttributes: PropTypes.func.isRequired,
};

export default LatestStoriesEdit;
