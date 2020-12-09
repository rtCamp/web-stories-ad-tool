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
import { useDebouncedCallback } from 'use-debounce';

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * LatestStoriesEdit props.
 *
 * @typedef LatestStoriesEditProps
 *
 * @property {Object}   attributes    Block attributes.
 * @property {()=>void} setAttributes Callable function for saving attribute values.
 */

/**
 * Internal dependencies
 */
import StoriesInspectorControls from '../../storiesInspectorControls';
import StoriesBlockControls from '../../storiesBlockControls';
import StoriesLoading from '../../storiesLoading';
import { FETCH_STORIES_DEBOUNCE } from '../../constants';
import StoriesPreview from '../../storiesPreview';

/**
 * Module constants
 */
const LATEST_STORIES_QUERY = {
  per_page: 20,
  _embed: 'author',
};

/**
 * LatestStoriesEdit component
 *
 * @param {LatestStoriesEditProps} props Component props.
 *
 * @return {*} JSX markup for the editor.
 */
const LatestStoriesEdit = ({ attributes, setAttributes }) => {
  const {
    blockType,
    align,
    viewType,
    numOfStories,
    numOfColumns,
    orderByValue,
    viewAllLinkLabel,
    authors,
    isStyleSquared,
  } = attributes;

  const [fetchedStories, setFetchedStories] = useState([]);
  const [isFetchingStories, setIsFetchingStories] = useState([]);

  /**
   * Fetch stories based on the query.
   *
   * @return {void}
   */
  const fetchStories = async () => {
    try {
      setIsFetchingStories(true);
      const stories = await apiFetch({
        path: addQueryArgs('/web-stories/v1/web-story', LATEST_STORIES_QUERY),
      });

      if ('undefined' !== typeof stories && Array.isArray(stories)) {
        setFetchedStories(stories);
      }
    } catch (err) {
      setFetchedStories([]);
    } finally {
      setIsFetchingStories(false);
    }
  };

  const [debouncedFetchStories] = useDebouncedCallback(
    fetchStories,
    FETCH_STORIES_DEBOUNCE
  );

  useEffect(() => {
    let order = 'desc',
      orderBy = 'date';

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
        break;
      case 'random':
        orderBy = 'rand';
        break;
      default:
        orderBy = 'date';
        order = 'desc';
    }

    LATEST_STORIES_QUERY.author = authors.map((author) => author.id);
    LATEST_STORIES_QUERY.order = order;
    LATEST_STORIES_QUERY.orderby = orderBy;

    debouncedFetchStories();
  }, [authors, orderByValue, debouncedFetchStories]);

  useEffect(() => {
    if (numOfStories <= fetchedStories.length) {
      // No need to fetch stories when reducing number of stories.
      return;
    }

    LATEST_STORIES_QUERY.per_page = numOfStories;

    debouncedFetchStories();
    /* eslint-disable react-hooks/exhaustive-deps */
    /* Disabled because the hook shouldn't be dependent on fetchedStories's length, this hook is specifically when user
    changes number of stories. fetchedStories variable may change even if user changes 'order' of stories or 'authors' filter. */
  }, [numOfStories, debouncedFetchStories]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const viewAllLabel = viewAllLinkLabel
    ? viewAllLinkLabel
    : __('View All Stories', 'web-stories');

  const storiesToDisplay =
    fetchedStories.length > numOfStories
      ? fetchedStories.slice(0, numOfStories)
      : fetchedStories;

  const alignmentClass = classNames({ [`align${align}`]: align });
  const blockClasses = classNames(
    {
      'is-style-default': !isStyleSquared,
      'is-style-squared': isStyleSquared,
    },
    'web-stories-list',
    { [`is-view-type-${viewType}`]: viewType },
    { [`columns-${numOfColumns}`]: 'grid' === viewType && numOfColumns }
  );

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
      />

      {isFetchingStories && <StoriesLoading />}

      {!isFetchingStories &&
        storiesToDisplay &&
        0 < storiesToDisplay.length && (
          <StoriesPreview
            attributes={attributes}
            alignmentClass={alignmentClass}
            blockClasses={blockClasses}
            storiesObject={storiesToDisplay}
            viewAllLabel={viewAllLabel}
          />
        )}
    </>
  );
};

LatestStoriesEdit.propTypes = {
  attributes: PropTypes.shape({
    blockType: PropTypes.string,
    align: PropTypes.string,
    viewType: PropTypes.string,
    numOfStories: PropTypes.number,
    numOfColumns: PropTypes.number,
    orderByValue: PropTypes.string,
    isShowingTitle: PropTypes.bool,
    isShowingExcerpt: PropTypes.bool,
    isShowingDate: PropTypes.bool,
    isShowingAuthor: PropTypes.bool,
    isShowingViewAll: PropTypes.bool,
    viewAllLinkLabel: PropTypes.string,
    authors: PropTypes.array,
    imageOnRight: PropTypes.bool,
    isStyleSquared: PropTypes.bool,
    sizeOfCircles: PropTypes.number,
  }),
  setAttributes: PropTypes.func.isRequired,
};

export default LatestStoriesEdit;
