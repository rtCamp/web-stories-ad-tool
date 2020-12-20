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
 * Internal dependencies
 */
import StoriesInspectorControls from '../../components/storiesInspectorControls';
import StoriesBlockControls from '../../components/storiesBlockControls';
import StoriesLoading from '../../components/storiesLoading';
import { FETCH_STORIES_DEBOUNCE, ORDER_BY_OPTIONS } from '../../constants';
import StoriesPreview from '../../components/storiesPreview';
import { useConfig } from '../../../../dashboard/app/config';
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
 * @param {Object}   root0               Component props.
 * @param {Object}   root0.attributes    Block attributes.
 * @param {Function} root0.setAttributes Callable function for saving attribute values.
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

  const { api } = useConfig();

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
        path: addQueryArgs(api.stories, LATEST_STORIES_QUERY),
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
    if (orderByValue) {
      const order = ORDER_BY_OPTIONS[orderByValue].order || 'desc';
      const orderBy = ORDER_BY_OPTIONS[orderByValue].orderBy || 'date';

      LATEST_STORIES_QUERY.order = order;
      LATEST_STORIES_QUERY.orderby = orderBy;
    }

    LATEST_STORIES_QUERY.author = authors.map((author) => author.id);

    debouncedFetchStories();
  }, [authors, numOfStories, orderByValue, debouncedFetchStories]);

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
