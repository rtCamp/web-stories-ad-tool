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
import { Icon, check, minus } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { PageSizePropType } from '../../dashboard/types';
import {
  SearchPropTypes,
  SortPropTypes,
} from '../../dashboard/utils/useStoryView';
import {
  TEXT_INPUT_DEBOUNCE,
  DROPDOWN_TYPES,
  STORY_SORT_MENU_ITEMS,
} from '../../dashboard/constants';
import { DASHBOARD_LEFT_NAV_WIDTH } from '../../dashboard/constants/pageStructure';
import {
  CardPreviewContainer,
  CardTitle,
  Dropdown,
} from '../../dashboard/components';
import TypeaheadSearch from '../../dashboard/app/views/shared/typeaheadSearch';
import { UnitsProvider } from '../../edit-story/units';
import { TransformProvider } from '../../edit-story/components/transform';
import FontProvider from '../../dashboard/app/font/fontProvider';
import { StoryGrid, StoryGridItem } from './components/cardGridItem';

const StoryFilter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

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

const SearchContainer = styled.div`
  display: inline-block;
  vertical-align: baseline;
  position: relative;
  width: 100%;
  height: 29px;
  @media ${({ theme }) => theme.breakpoint.smallDisplayPhone} {
    left: ${({ theme }) => `${theme.standardViewContentGutter.min}px`};
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

const StorySortDropdownContainer = styled.div`
  margin: auto 8px;
  align-self: flex-end;
`;

const SortDropdown = styled(Dropdown)``;

const ItemOverlay = styled.a(
  ({ pageSize }) => `
  display: block;
  position: absolute;
  z-index: 1;
  width: 100%;
  height: ${pageSize.containerHeight}px;

  &:focus {
    box-shadow: 0 0 3px 3px #5b9dd9, 0 0 2px 1px rgba(30, 140, 190, 0.8);
  }

  &.item-selected {

    .item-selected-icon {
      position: absolute;
      top: -7px;
      right: -7px;
      z-index: 1;

      svg {
        background-color: #ccc;
        box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        stroke: #000;
        stroke-width: 2px;
        padding: 3px;
      }

      .item-selected-icon-minus {
        display: none;
      }

      &:hover {
        .item-selected-icon-minus {
          display: block;
        }

        .item-selected-icon-check {
          display: none;
        }
      }
    }

    &:focus {

      .item-selected-icon {

        svg {
          background-color: #0073aa;
          stroke: #fff;
        }
      }
    }
  }
`
);

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
  sort,
  addItemToSelectedStories,
  removeItemFromSelectedStories,
}) {
  const [debouncedTypeaheadChange] = useDebouncedCallback((value) => {
    search.setKeyword(value);
  }, TEXT_INPUT_DEBOUNCE);

  const onSortChange = useCallback(
    (newSort) => {
      sort.set(newSort);
    },
    [sort]
  );

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
        <StorySortDropdownContainer>
          <SortDropdown
            alignment="flex-end"
            ariaLabel={__('Choose sort option for display', 'web-stories')}
            items={STORY_SORT_MENU_ITEMS}
            type={DROPDOWN_TYPES.MENU}
            value={sort.value}
            onChange={(newSort) => {
              onSortChange(newSort.value);
            }}
          />
        </StorySortDropdownContainer>
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
                pageSize={pageSize}
                role="list"
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
                      <CardPreviewContainer
                        ariaLabel={sprintf(
                          /* translators: %s: story title. */
                          __('preview of %s', 'web-stories'),
                          story.title
                        )}
                        pageSize={pageSize}
                        story={story}
                      />
                      <DetailRow>
                        <CardTitle
                          tabIndex={-1}
                          title={story.title}
                          titleLink={story.editStoryLink}
                          status={story?.status}
                          id={story.id}
                        />
                      </DetailRow>
                      <ItemOverlay
                        className={isSelected ? 'item-selected' : ''}
                        pageSize={pageSize}
                        href={`#select-story-${story.id}`}
                        onClick={(event) => {
                          event.preventDefault();
                          addItemToSelectedStories(story.id);
                        }}
                      >
                        {isSelected && (
                          <div className="item-selected-icon">
                            <Icon
                              className="item-selected-icon-check"
                              icon={check}
                            />
                            <Icon
                              className="item-selected-icon-minus"
                              icon={minus}
                              onClick={(event) => {
                                event.preventDefault();
                                removeItemFromSelectedStories(story.id);
                              }}
                            />
                          </div>
                        )}
                      </ItemOverlay>
                    </StoryGridItem>
                  );
                })}
              </StoryGrid>
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
  sort: SortPropTypes,
  addItemToSelectedStories: PropTypes.func,
  removeItemFromSelectedStories: PropTypes.func,
};

export default SelectStories;
