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
import { __, sprintf } from '@wordpress/i18n';
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
import { ScrollToTop, Layout } from '../../dashboard/components';
import { useConfig } from '../../dashboard/app/config';
import SelectStories from './selectStories';
import SortStories from './sortStories';
import LoaderContainer from './components/loaderContainer';

const StoryPickerModal = styled(Modal)`
  width: calc(100% - 16px - 16px);
  height: calc(100% - 60px - 60px);
  position: relative;
  overflow: hidden;
`;

const ModalContent = styled.div`
  position: relative;
  height: calc(100% - 93px);
  margin: -24px -24px 0;
  padding: 0;
`;

const ModalContentInner = styled.div`
  padding: 12px 24px 24px;
`;

const ModalFooter = styled.div`
  position: fixed;
  bottom: 0;
  z-index: 2;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f3f3f3;
  border-top: 1px solid #ddd;
  margin: 0 -24px;
  padding: 10px 24px;

  .components-button {
    margin-left: 8px;
  }
`;

const ModalFooterLeft = styled.div`
  min-width: 1px;
`;

const LimitIndicator = styled.span(
  ({ reachedMaximum }) => `
  font-weight: 600;
  color: ${reachedMaximum ? '#EB5757' : 'inherit'};
`
);

const ModalFooterRight = styled.div``;

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
  const [currentAuthor, setCurrentAuthor] = useState('0');
  const { maxNumOfStories } = useConfig();

  const {
    fetchStories,
    stories,
    storiesOrderById,
    totalPages,
    allPagesFetched,
    isLoading,
  } = useApi(
    ({
      actions: {
        storyApi: { fetchStories },
      },
      state: {
        stories: {
          stories,
          storiesOrderById,
          totalPages,
          allPagesFetched,
          isLoading,
        },
      },
    }) => ({
      fetchStories,
      stories,
      storiesOrderById,
      totalPages,
      allPagesFetched,
      isLoading,
    })
  );

  const fetchWebStories = async () => {
    const query = {
      page: page.value,
      searchTerm: search.keyword,
      sortDirection: view.style === VIEW_STYLE.LIST && sort.direction,
      sortOption: sort.value,
      status: STORY_STATUS.PUBLISH,
    };

    if (currentAuthor) {
      query.author = parseInt(currentAuthor);
    }

    await fetchStories(query);
    setFetchingForTheFirstTime(false);
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
    currentAuthor,
    sort.direction,
    sort.value,
    view.style,
  ]);

  const addItemToSelectedStories = (storyId) => {
    if (selectedStories.length >= maxNumOfStories) {
      return;
    }

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
    <StoryPickerModal
      title={__('Web Stories', 'web-stories')}
      onRequestClose={closeStoryPicker}
      shouldCloseOnClickOutside={false}
    >
      <ModalContent>
        {fetchingForTheFirstTime ? (
          <LoaderContainer>
            {__('Fetching stories', 'web-stories')}
          </LoaderContainer>
        ) : (
          <Layout.Provider>
            <Layout.Scrollable>
              <ModalContentInner>
                {isSortingStories ? (
                  <SortStories
                    selectedStories={selectedStories}
                    setSelectedStories={setSelectedStories}
                    orderedStories={orderedStories}
                    pageSize={view.pageSize}
                    setSelectedStoriesObject={setSelectedStoriesObject}
                    selectedStoriesObject={selectedStoriesObject}
                    addItemToSelectedStories={addItemToSelectedStories}
                    removeItemFromSelectedStories={
                      removeItemFromSelectedStories
                    }
                  />
                ) : (
                  <SelectStories
                    selectedStories={selectedStories}
                    orderedStories={orderedStories}
                    pageSize={view.pageSize}
                    search={search}
                    currentAuthor={currentAuthor}
                    setCurrentAuthor={setCurrentAuthor}
                    sort={sort}
                    addItemToSelectedStories={addItemToSelectedStories}
                    removeItemFromSelectedStories={
                      removeItemFromSelectedStories
                    }
                    allPagesFetched={allPagesFetched}
                    isLoading={isLoading}
                    page={page}
                  />
                )}
              </ModalContentInner>
            </Layout.Scrollable>
            <Layout.Fixed>
              <ScrollToTop />
            </Layout.Fixed>
          </Layout.Provider>
        )}
      </ModalContent>
      <ModalFooter>
        <ModalFooterLeft>
          {!isSortingStories && !fetchingForTheFirstTime && (
            <LimitIndicator
              reachedMaximum={selectedStories.length >= maxNumOfStories}
            >
              {sprintf(
                /* translators: %1$d: Number of selected stories, %2$d: Maximum allowed stories */
                __('%1$d of %2$d stories selected', 'web-stories'),
                selectedStories.length,
                maxNumOfStories
              )}
            </LimitIndicator>
          )}
        </ModalFooterLeft>
        <ModalFooterRight>
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
        </ModalFooterRight>
      </ModalFooter>
    </StoryPickerModal>
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
