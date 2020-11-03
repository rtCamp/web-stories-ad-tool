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
import ServerSideRender from '@wordpress/server-side-render';

/**
 * Internal dependencies
 */
import LatestControls from './latestControls';

import './edit.css';

const LatestStoriesEdit = ({ attributes, setAttributes }) => {
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
    carouselSettings,
    authors,
    listViewImageAlignment,
  } = attributes;

  return (
    <>
      <ServerSideRender
        block="web-stories/latest-stories"
        attributes={attributes}
      />
      <LatestControls
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
    </>
  );
};

LatestStoriesEdit.propTypes = {
  attributes: PropTypes.shape({
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
