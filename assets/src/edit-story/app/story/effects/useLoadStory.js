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

/**
 * Internal dependencies
 */
import { useAPI } from '../../api';
import { useHistory } from '../../history';
import { getDataFromSessionStorage } from '../utils/sessionStore';
import getInitialStoryState from '../utils/getInitialStoryState';

// When ID is set, load story from API.
function useLoadStory({ storyId, shouldLoad, restore, isDemo }) {
  const {
    actions: { getStoryById, getDemoStoryById },
  } = useAPI();
  const {
    actions: { clearHistory },
  } = useHistory();

  useEffect(() => {
    if (storyId && shouldLoad) {
      // First clear history completely.
      clearHistory();

      let storyToRestore = getInitialStoryState();
      const sessionData = getDataFromSessionStorage();

      if (sessionData) {
        storyToRestore = sessionData;
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
  ]);
}

export default useLoadStory;
