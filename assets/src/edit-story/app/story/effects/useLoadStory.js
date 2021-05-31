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
import { useEffect } from 'react';
import { migrate } from '@web-stories-wp/migration';

/**
 * Internal dependencies
 */
import { useAPI } from '../../api';
import { useHistory } from '../../history';
import useAdStory from '../../storyAd/useAdStory';
import { createPage } from '../../../elements';
import getUniquePresets from '../../../utils/getUniquePresets';
import { getDataFromSessionStorage } from '../utils/sessionStore';

// When ID is set, load story from API.
function useLoadStory({ storyId, shouldLoad, restore, isDemo }) {
  const {
    actions: { getStoryById, getDemoStoryById },
  } = useAPI();
  const {
    actions: { clearHistory },
  } = useHistory();

  const {
    actions: {
      updateCTALink,
      updateCtaText,
      updateCustomCtaText,
      updateLandingPageType,
    },
  } = useAdStory();

  useEffect(() => {
    if (storyId && shouldLoad) {
      const globalStoryStyles = {
        colors: [],
        textStyles: [],
      };

      // First clear history completely.
      clearHistory();

      // If there are no pages, create empty page.
      const storyData = migrate([], 0);
      const pages =
        storyData?.pages?.length > 0 ? storyData.pages : [createPage()];

      // Set story-global variables.
      const story = {
        storyId,
        currentStoryStyles: {
          colors: storyData?.currentStoryStyles?.colors
            ? getUniquePresets(storyData.currentStoryStyles.colors)
            : [],
        },
        globalStoryStyles,
        autoAdvance: storyData?.autoAdvance,
        defaultPageDuration: storyData?.defaultPageDuration,
      };

      let storyToRestore = {
        pages,
        story,
        selection: [],
        current: null, // will be set to first page by `restore`
      };

      const sessionData = getDataFromSessionStorage();

      if (sessionData) {
        storyToRestore = sessionData;
      }

      if (storyToRestore.storyAd) {
        updateCTALink(storyToRestore.storyAd.ctaLink);
        updateCtaText(storyToRestore.storyAd.ctaText);
        updateCustomCtaText(storyToRestore.storyAd.customCtaText);
        updateLandingPageType(storyToRestore.storyAd.landingPageType);
      }

      restore(storyToRestore);
    }
  }, [
    storyId,
    shouldLoad,
    restore,
    isDemo,
    getStoryById,
    getDemoStoryById,
    clearHistory,
    updateCTALink,
    updateCtaText,
    updateCustomCtaText,
    updateLandingPageType,
  ]);
}

export default useLoadStory;
