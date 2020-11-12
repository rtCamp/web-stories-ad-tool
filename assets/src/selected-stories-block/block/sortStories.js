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
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { PageSizePropType } from '../../dashboard/types';
import { CardPreviewContainer } from '../../dashboard/components';
import { UnitsProvider } from '../../edit-story/units';
import { TransformProvider } from '../../edit-story/components/transform';
import FontProvider from '../../dashboard/app/font/fontProvider';
import { StoryGrid, StoryGridItem } from './components/cardGridItem';

function SortStories({
  selectedStories,
  // setSelectedStories,
  orderedStories,
  pageSize,
}) {
  return (
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
            {orderedStories
              .filter((story) => selectedStories.includes(story.id))
              .map((story) => {
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
                  </StoryGridItem>
                );
              })}
          </StoryGrid>
        </UnitsProvider>
      </TransformProvider>
    </FontProvider>
  );
}

SortStories.propTypes = {
  selectedStories: PropTypes.array,
  // setSelectedStories: PropTypes.func,
  orderedStories: PropTypes.array,
  pageSize: PageSizePropType,
};

export default SortStories;
