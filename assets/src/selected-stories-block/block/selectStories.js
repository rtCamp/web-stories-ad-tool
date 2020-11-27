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
import { useDebouncedCallback } from 'use-debounce';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useCallback, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { PageSizePropType } from '../../dashboard/types';
import {
  SearchPropTypes,
  SortPropTypes,
  PagePropTypes,
} from '../../dashboard/utils/useStoryView';
import {
  TEXT_INPUT_DEBOUNCE,
  DROPDOWN_TYPES,
  STORY_SORT_MENU_ITEMS,
} from '../../dashboard/constants';
import { getRelativeDisplayDate } from '../../date';
import { DASHBOARD_LEFT_NAV_WIDTH } from '../../dashboard/constants/pageStructure';
import {
  CardTitle,
  Dropdown,
  InfiniteScroller,
} from '../../dashboard/components';
import TypeaheadSearch from '../../dashboard/app/views/shared/typeaheadSearch';
import { UnitsProvider } from '../../edit-story/units';
import { TransformProvider } from '../../edit-story/components/transform';
import FontProvider from '../../dashboard/app/font/fontProvider';
import { StoryGridItem } from './components/cardGridItem';
import ItemOverlay from './components/itemOverlay';
import StoryPreview from './storyPreview';

const StoryFilter = styled.div`
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 10px 0;
  margin-top: -12px;
  display: flex;
  justify-content: space-between;
  background-color: #fff;

  #typeahead-search {
    min-height: 18px;
    border: 0;
    background: transparent;

    &:focus {
      outline: none !important;
      box-shadow: none !important;
    }
  }
`;

const StoryGrid = styled.div(
  ({ columnWidth, theme }) => `
  display: grid;
  overflow: auto !important;
  width: 100%;
  height: calc(100% - 95px) !important;
  padding: 10px 5px;
  grid-column-gap: ${theme.DEPRECATED_THEME.grid.columnGap.desktop}px;
  grid-row-gap: 80px;
  grid-template-columns: repeat(auto-fill, ${columnWidth - 5}px);
  grid-template-rows: auto !important;
  scroll-margin-top: 30vh;
  margin-top: 2px; // this is for keyboard focus

  ${theme.DEPRECATED_THEME.breakpoint.tablet} {
    grid-column-gap: ${theme.DEPRECATED_THEME.grid.columnGap.tablet}px;
  }
  ${theme.DEPRECATED_THEME.breakpoint.largeDisplayPhone} {
    grid-column-gap: ${
      theme.DEPRECATED_THEME.grid.columnGap.largeDisplayPhone
    }px;
  }
  ${theme.DEPRECATED_THEME.breakpoint.smallDisplayPhone} {
    grid-column-gap: ${
      theme.DEPRECATED_THEME.grid.columnGap.smallDisplayPhone
    }px;
  }
  ${theme.DEPRECATED_THEME.breakpoint.min} {
    grid-column-gap: ${theme.DEPRECATED_THEME.grid.columnGap.min}px;
  }
`
);

const SearchContainer = styled.div`
  display: inline-block;
  vertical-align: baseline;
  position: relative;
  width: 100%;
  height: 29px;
  @media ${({ theme }) => theme.DEPRECATED_THEME.breakpoint.smallDisplayPhone} {
    left: ${({ theme }) =>
      `${theme.DEPRECATED_THEME.standardViewContentGutter.min}px`};
    max-width: 100%;
    justify-content: flex-start;
  }
`;

const SearchInner = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: min(${DASHBOARD_LEFT_NAV_WIDTH}px, 100%);
  display: flex;
  justify-content: flex-end;
`;

const DropdownContainer = styled.div`
  margin: auto 8px;
  align-self: flex-end;
`;

const AuthorDropdown = styled(Dropdown)`
  & > div {
    max-height: 350px;
    overflow-x: hidden;
    overflow-y: auto;
    border-radius: 8px;
    box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25);

    & > div {
      box-shadow: none;
    }
  }
`;

const DetailRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

function SelectStories({
  selectedStories,
  orderedStories,
  pageSize,
  search,
  currentAuthor,
  setCurrentAuthor,
  sort,
  addItemToSelectedStories,
  removeItemFromSelectedStories,
  allPagesFetched,
  isLoading,
  page,
}) {
  const [authors, setAuthors] = useState([]);
  const [debouncedTypeaheadChange] = useDebouncedCallback((value) => {
    search.setKeyword(value);
  }, TEXT_INPUT_DEBOUNCE);

  const onSortChange = useCallback(
    (newSort) => {
      sort.set(newSort);
    },
    [sort]
  );

  useEffect(() => {
    const items = [
      {
        label: __('All authors', 'web-stories'),
        value: '0',
      },
    ];

    global.webStoriesSelectedBlockSettings.authors.forEach((author) => {
      items.push({
        label: author.display_name,
        value: author.ID.toString(),
      });
    });

    setAuthors(items);
  }, []);

  return (
    <>
      <StoryFilter data-testid="story-filter">
        <SearchContainer>
          <SearchInner>
            <TypeaheadSearch
              placeholder={__('Search Stories', 'web-stories')}
              currentValue={search.keyword}
              stories={orderedStories}
              handleChange={debouncedTypeaheadChange}
            />
          </SearchInner>
        </SearchContainer>
        <DropdownContainer>
          <AuthorDropdown
            alignment="flex-end"
            ariaLabel={__('Choose an author to filter', 'web-stories')}
            items={authors}
            type={DROPDOWN_TYPES.MENU}
            value={currentAuthor}
            onChange={(author) => {
              setCurrentAuthor(author.value);
            }}
          />
        </DropdownContainer>
        <DropdownContainer>
          <Dropdown
            alignment="flex-end"
            ariaLabel={__('Choose sort option for display', 'web-stories')}
            items={STORY_SORT_MENU_ITEMS}
            type={DROPDOWN_TYPES.MENU}
            value={sort.value}
            onChange={(newSort) => {
              onSortChange(newSort.value);
            }}
          />
        </DropdownContainer>
      </StoryFilter>
      {!orderedStories.length && search.keyword && (
        <p>
          {sprintf(
            /* translators: %s: story title. */
            __(
              `Sorry, we couldn't find any results matching "%s"`,
              'web-stories'
            ),
            search.keyword
          )}
        </p>
      )}
      {!orderedStories.length && !search.keyword && (
        <p>{__(`Sorry, we couldn't find any results`, 'web-stories')}</p>
      )}
      {orderedStories.length >= 1 && (
        <FontProvider>
          <TransformProvider>
            <UnitsProvider
              pageSize={{
                width: pageSize.width,
                height: pageSize.height,
              }}
            >
              <StoryGrid
                role="list"
                columnWidth={pageSize.width}
                ariaLabel={__('Viewing stories', 'web-stories')}
              >
                {orderedStories.map((story) => {
                  const isSelected = selectedStories.includes(story.id);

                  return (
                    <StoryGridItem
                      key={story.id}
                      role="listitem"
                      data-testid={`story-grid-item-${story.id}`}
                    >
                      <StoryPreview story={story} pageSize={pageSize} />
                      <DetailRow>
                        <CardTitle
                          tabIndex={-1}
                          title={story.title}
                          titleLink={story.editStoryLink}
                          status={story?.status}
                          id={story.id}
                          secondaryTitle={story.author}
                          displayDate={getRelativeDisplayDate(story.created)}
                        />
                      </DetailRow>
                      <ItemOverlay
                        isSelected={isSelected}
                        pageSize={pageSize}
                        storyId={story.id}
                        addItemToSelectedStories={addItemToSelectedStories}
                        removeItemFromSelectedStories={
                          removeItemFromSelectedStories
                        }
                      />
                    </StoryGridItem>
                  );
                })}
              </StoryGrid>
              <InfiniteScroller
                canLoadMore={!allPagesFetched}
                isLoading={isLoading}
                allDataLoadedMessage={__('No more stories', 'web-stories')}
                onLoadMore={page.requestNextPage}
              />
            </UnitsProvider>
          </TransformProvider>
        </FontProvider>
      )}
    </>
  );
}

SelectStories.propTypes = {
  selectedStories: PropTypes.array,
  orderedStories: PropTypes.array,
  pageSize: PageSizePropType,
  search: SearchPropTypes,
  currentAuthor: PropTypes.string,
  setCurrentAuthor: PropTypes.func,
  sort: SortPropTypes,
  addItemToSelectedStories: PropTypes.func,
  removeItemFromSelectedStories: PropTypes.func,
  allPagesFetched: PropTypes.bool,
  isLoading: PropTypes.bool,
  page: PagePropTypes,
};

export default SelectStories;
