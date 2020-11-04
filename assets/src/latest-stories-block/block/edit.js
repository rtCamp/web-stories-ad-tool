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
import { useEffect, useState, useRef } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

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

  useEffect(() => {
    let order,
      orderBy = '';

    switch (orderByValue) {
      case 'old-to-new':
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
      default:
        orderBy = 'date';
        order = 'desc';
    }

    const latestPostsQuery = {
      author: authors,
      order,
      orderby: orderBy,
      per_page: numOfStories,
    };

    apiFetch({
      path: `/web-stories/v1/web-story?${new URLSearchParams(
        latestPostsQuery
      )}`,
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

  const refs = useRef([]);
  const willShowStoryPoster =
    'list' === viewType || 'circles' === viewType ? true : isShowingStoryPoster;
  const willShowTitle = 'circles' === viewType ? false : isShowingTitle;
  const willShowDate = 'circles' === viewType ? false : isShowingDate;
  const willShowAuthor = 'circles' === viewType ? false : isShowingAuthor;
  const viewAllLabel = viewAllLinkLabel
    ? viewAllLinkLabel
    : __('View All Stories', 'web-stories');

  useEffect(() => {
    if (willShowStoryPoster) {
      return;
    }

    refs.current = refs.current.slice(0, fetchedStories.length);

    refs.current.forEach((el, index) => {
      if (global.AmpStoryPlayer) {
        refs.current[index] = new global.AmpStoryPlayer(
          global,
          refs.current[index]
        );
        refs.current[index].load();
      }
    });
  }, [fetchedStories, willShowStoryPoster]);

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
      {fetchedStories && 0 < fetchedStories.length && (
        <div>
          <div className={blockClasses} style={blockStyles}>
            {Object.keys(fetchedStories).map((index) => {
              const storyData = fetchedStories[index];

              return (
                <StoryPlayer
                  key={index}
                  ref={(el) => (refs.current[index] = el)}
                  url={storyData.link}
                  title={storyData.title.rendered}
                  date={storyData.date}
                  poster={storyData.featured_media_url}
                  isShowingStoryPoster={willShowStoryPoster}
                  listViewImageAlignment={listViewImageAlignment}
                  isShowingAuthor={willShowAuthor}
                  isShowingDate={willShowDate}
                  isShowingTitle={willShowTitle}
                />
              );
            })}
          </div>
          {isShowingViewAll && (
            <div className="latest-stories__archive-link">{viewAllLabel}</div>
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
