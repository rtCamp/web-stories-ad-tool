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
import { Button, Modal, Spinner } from '@wordpress/components';
import { useState, useEffect, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import useApi from '../../dashboard/app/api/useApi';
import { VIEW_STYLE, STORY_STATUSES } from '../../dashboard/constants';
import { useStoryView } from '../../dashboard/utils';
import SelectStories from './selectStories';
import SortStories from './sortStories';

const ModalContent = styled.div(
  ({ pageSize, theme }) => `
  position: relative;
  width: calc((${pageSize.width}px * 5) + (${theme.grid.columnGap.desktop}px*7) - 12px);
  height: calc(100vh - (61px * 3));
  margin: -24px;
  overflow: hidden;
  padding: 12px 24px 0;

  @media only ${theme.breakpoint.tablet} {
    width: calc((${pageSize.width}px * 4) + (${theme.grid.columnGap.tablet}px*3));
  }

  @media only ${theme.breakpoint.min} {
    width: 100%;
  }
`
);

const ModalFooter = styled.div`
  position: absolute;
  bottom: 0;
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

const LoaderContainer = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;

  .components-spinner {
    margin-top: 0;
  }
`;

function StoryPicker({
  selectedStories,
  setSelectedStories,
  closeStoryPicker,
}) {
  const [fetchingForTheFirstTime, setFetchingForTheFirstTime] = useState(true);
  const [isSortingStories, setIsSortingStories] = useState(false);

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
      status: filter.value,
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
    fetchWebStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
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
    }
  };

  const removeItemFromSelectedStories = (storyId) => {
    setSelectedStories(selectedStories.filter((id) => storyId !== id));
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
            <Spinner />
          </LoaderContainer>
        ) : isSortingStories ? (
          <SortStories
            selectedStories={selectedStories}
            setSelectedStories={setSelectedStories}
            orderedStories={orderedStories}
            pageSize={view.pageSize}
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
            <>
              <Button onClick={() => setIsSortingStories(false)}>
                {__('Select More Stories', 'web-stories')}
              </Button>
              <Button isPrimary>{__('Insert Stories', 'web-stories')}</Button>
            </>
          ) : (
            <Button
              isPrimary
              onClick={() => setIsSortingStories(true)}
              disabled={!selectedStories.length}
            >
              {__('Rearrange Stories', 'web-stories')}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

StoryPicker.propTypes = {
  selectedStories: PropTypes.array,
  setSelectedStories: PropTypes.func,
  closeStoryPicker: PropTypes.func,
};

export default StoryPicker;
