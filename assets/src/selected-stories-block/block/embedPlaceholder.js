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
import { Button, Placeholder, Modal, Spinner } from '@wordpress/components';
import { BlockIcon } from '@wordpress/block-editor';
import { useState, useMemo, useRef } from '@wordpress/element';
import { Icon, check, minus } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import useApi from '../../dashboard/app/api/useApi';
import { VIEW_STYLE, STORY_STATUSES } from '../../dashboard/constants';
import { useStoryView } from '../../dashboard/utils';
import {
  CardGrid,
  CardGridItem,
  CardPreviewContainer,
  CardTitle,
} from '../../dashboard/components';
import { UnitsProvider } from '../../edit-story/units';
import { TransformProvider } from '../../edit-story/components/transform';
import FontProvider from '../../dashboard/app/font/fontProvider';

const ModalContent = styled.div(
  ({ pageSize, theme }) => `
  width: calc((${pageSize.width}px * 5) + (${theme.grid.columnGap.desktop}px*4));
  height: calc(100vh - (60px * 4));

  @media only ${theme.breakpoint.tablet} {
    width: calc((${pageSize.width}px * 4) + (${theme.grid.columnGap.tablet}px*3));
  }

  @media only ${theme.breakpoint.min} {
    width: 100%;
  }
`
);

const LoaderContainer = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;

  .components-spinner {
    margin-top: 0;
  }
`;

const StoryGrid = styled(CardGrid)`
  width: ${({ theme }) =>
    `calc(100% - ${theme.standardViewContentGutter.desktop}px)`};

  @media ${({ theme }) => theme.breakpoint.smallDisplayPhone} {
    width: ${({ theme }) =>
      `calc(100% - ${theme.standardViewContentGutter.min}px)`};
  }
`;

const StoryGridItem = styled(CardGridItem)`
  position: relative;
`;

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

export const DetailRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const EmbedPlaceholder = ({
  icon,
  label,
  selectedStories,
  setSelectedStories,
}) => {
  const [isStoryPickerOpen, setIsStoryPickerOpen] = useState(false);
  const gridRef = useRef();
  const itemRefs = useRef({});

  const {
    fetchStories,
    isLoading,
    stories,
    storiesOrderById,
    totalPages,
  } = useApi(
    ({
      actions: {
        storyApi: { fetchStories },
      },
      state: {
        stories: { isLoading, stories, storiesOrderById, totalPages },
      },
    }) => ({
      fetchStories,
      isLoading,
      stories,
      storiesOrderById,
      totalPages,
    })
  );

  const orderedStories = useMemo(() => {
    return storiesOrderById.map((storyId) => {
      return stories[storyId];
    });
  }, [stories, storiesOrderById]);

  const { filter, page, search, sort, view } = useStoryView({
    filters: STORY_STATUSES,
    totalPages,
  });

  const openStoryPicker = () => setIsStoryPickerOpen(true);
  const closeStoryPicker = () => setIsStoryPickerOpen(false);

  const openStoryPickerModal = async () => {
    openStoryPicker();
    await fetchStories({
      page: page.value,
      searchTerm: search.keyword,
      sortDirection: view.style === VIEW_STYLE.LIST && sort.direction,
      sortOption: sort.value,
      status: filter.value,
    });
  };

  const addItemToSelectedStories = (storyId) => {
    if (!selectedStories.includes(storyId)) {
      setSelectedStories([...selectedStories, storyId]);
    }
  };

  const removeItemFromSelectedStories = (storyId) => {
    setSelectedStories(selectedStories.filter((id) => storyId !== id));
  };

  return (
    <Placeholder
      icon={<BlockIcon icon={icon} showColors />}
      label={label}
      className="wp-block-web-stories-embed"
      instructions={__(
        'Select the web stories you want to display on your site.',
        'web-stories'
      )}
    >
      <Button isPrimary onClick={openStoryPickerModal}>
        {__('Select Stories', 'web-stories')}
      </Button>
      {isStoryPickerOpen && (
        <Modal
          title={__('Web Stories', 'web-stories')}
          onRequestClose={closeStoryPicker}
        >
          <ModalContent pageSize={view.pageSize}>
            {isLoading ? (
              <LoaderContainer>
                {__('Fetching stories', 'web-stories')}
                <Spinner />
              </LoaderContainer>
            ) : (
              <FontProvider>
                <TransformProvider>
                  <UnitsProvider
                    pageSize={{
                      width: view.pageSize.width,
                      height: view.pageSize.height,
                    }}
                  >
                    <StoryGrid
                      pageSize={view.pageSize}
                      ref={gridRef}
                      role="list"
                      ariaLabel={__('Viewing stories', 'web-stories')}
                    >
                      {orderedStories.length &&
                        orderedStories.map((story) => {
                          const isSelected = selectedStories.includes(story.id);

                          return (
                            <StoryGridItem
                              key={story.id}
                              role="listitem"
                              data-testid={`story-grid-item-${story.id}`}
                              ref={(el) => {
                                itemRefs.current[story.id] = el;
                              }}
                            >
                              <CardPreviewContainer
                                ariaLabel={sprintf(
                                  /* translators: %s: story title. */
                                  __('preview of %s', 'web-stories'),
                                  story.title
                                )}
                                pageSize={view.pageSize}
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
                                pageSize={view.pageSize}
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
          </ModalContent>
        </Modal>
      )}
    </Placeholder>
  );
};

EmbedPlaceholder.propTypes = {
  icon: PropTypes.func,
  label: PropTypes.string,
  selectedStories: PropTypes.array,
  setSelectedStories: PropTypes.func,
};

export default EmbedPlaceholder;
