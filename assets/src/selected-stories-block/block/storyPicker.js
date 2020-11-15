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
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Modal } from '@wordpress/components';
import { useState, useEffect, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import useApi from '../../dashboard/app/api/useApi';
import {
  VIEW_STYLE,
  STORY_STATUSES,
  STORY_STATUS,
} from '../../dashboard/constants';
import { useStoryView } from '../../dashboard/utils';
import SelectStories from './selectStories';
import SortStories from './sortStories';
import LoaderContainer from './components/loaderContainer';

const ModalContent = styled.div(
  ({ pageSize, theme }) => `
  position: relative;
  width: calc((${pageSize.width}px * 5) + (${theme.DEPRECATED_THEME.grid.columnGap.desktop}px*7) - 12px);
  height: calc(100vh - (61px * 3));
  margin: -24px;
  overflow: hidden;
  padding: 12px 24px 0;

  @media only ${theme.DEPRECATED_THEME.breakpoint.tablet} {
    width: calc((${pageSize.width}px * 4) + (${theme.DEPRECATED_THEME.grid.columnGap.tablet}px*3));
  }

  @media only ${theme.DEPRECATED_THEME.breakpoint.min} {
    width: 100%;
  }
`
);

const ModalFooter = styled.div`
  position: absolute;
  bottom: 0;
  z-index: 2;
  width: 100%;
  background: #f3f3f3;
  border-top: 1px solid #ddd;
  margin: 0 -24px;
  padding: 10px 24px;
  text-align: right;

  .components-button {
    margin-left: 8px;
  }
`;

function StoryPicker({
  selectedStories,
  setSelectedStories,
  selectedStoriesObject,
  setSelectedStoriesObject,
  closeStoryPicker,
  isSortingStories,
  setIsSortingStories,
}) {
  const [fetchingForTheFirstTime, setFetchingForTheFirstTime] = useState(true);
  const { fetchStories, stories, storiesOrderById, totalPages } = useApi(
    ({
      actions: {
        storyApi: { fetchStories },
      },
      state: {
        stories: { stories, storiesOrderById, totalPages },
      },
    }) => ({
      fetchStories,
      stories,
      storiesOrderById,
      totalPages,
    })
  );

  const fetchWebStories = async () => {
    await fetchStories({
      page: page.value,
      searchTerm: search.keyword,
      sortDirection: view.style === VIEW_STYLE.LIST && sort.direction,
      sortOption: sort.value,
      status: STORY_STATUS.PUBLISH,
    });

    if (fetchingForTheFirstTime) {
      setFetchingForTheFirstTime(false);
    }
  };

  const orderedStories = useMemo(() => {
    return storiesOrderById.map((storyId) => {
      return stories[storyId];
    });
  }, [stories, storiesOrderById]);

  const { filter, page, search, sort, view } = useStoryView({
    filters: STORY_STATUSES,
    totalPages,
  });

  useEffect(() => {
    if (isSortingStories) {
      setFetchingForTheFirstTime(false);
      return;
    } else if (!orderedStories.length) {
      setFetchingForTheFirstTime(true);
    }

    fetchWebStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSortingStories,
    filter.value,
    page.value,
    search.keyword,
    sort.direction,
    sort.value,
    view.style,
  ]);

  const addItemToSelectedStories = (storyId) => {
    if (!selectedStories.includes(storyId)) {
      setSelectedStories([...selectedStories, storyId]);
      setSelectedStoriesObject([
        ...selectedStoriesObject,
        {
          ...orderedStories.find((story) => story.id === storyId)
            .originalStoryData,
        },
      ]);
    }
  };

  const removeItemFromSelectedStories = (storyId) => {
    setSelectedStories(selectedStories.filter((id) => storyId !== id));
    setSelectedStoriesObject(
      selectedStoriesObject.filter((story) => storyId !== story.id)
    );
  };

  return (
    <Modal
      title={__('Web Stories', 'web-stories')}
      onRequestClose={closeStoryPicker}
      shouldCloseOnClickOutside={false}
    >
      <ModalContent pageSize={view.pageSize}>
        {fetchingForTheFirstTime ? (
          <LoaderContainer>
            {__('Fetching stories', 'web-stories')}
          </LoaderContainer>
        ) : isSortingStories ? (
          <SortStories
            selectedStories={selectedStories}
            setSelectedStories={setSelectedStories}
            orderedStories={orderedStories}
            pageSize={view.pageSize}
            setSelectedStoriesObject={setSelectedStoriesObject}
            selectedStoriesObject={selectedStoriesObject}
            addItemToSelectedStories={addItemToSelectedStories}
            removeItemFromSelectedStories={removeItemFromSelectedStories}
          />
        ) : (
          <SelectStories
            selectedStories={selectedStories}
            orderedStories={orderedStories}
            pageSize={view.pageSize}
            search={search}
            sort={sort}
            addItemToSelectedStories={addItemToSelectedStories}
            removeItemFromSelectedStories={removeItemFromSelectedStories}
          />
        )}
        <ModalFooter>
          {isSortingStories ? (
            <Button onClick={() => setIsSortingStories(false)}>
              {__('Select More Stories', 'web-stories')}
            </Button>
          ) : (
            <Button
              onClick={() => setIsSortingStories(true)}
              disabled={selectedStories.length <= 1}
            >
              {__('Rearrange Stories', 'web-stories')}
            </Button>
          )}
          <Button
            isPrimary
            disabled={!selectedStories.length}
            onClick={closeStoryPicker}
          >
            {__('Insert Stories', 'web-stories')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

StoryPicker.propTypes = {
  selectedStories: PropTypes.array,
  setSelectedStories: PropTypes.func,
  selectedStoriesObject: PropTypes.array,
  setSelectedStoriesObject: PropTypes.func,
  closeStoryPicker: PropTypes.func,
  isSortingStories: PropTypes.bool,
  setIsSortingStories: PropTypes.func,
};

export default StoryPicker;
