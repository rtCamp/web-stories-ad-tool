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
import { useCallback, useEffect } from 'react';

/**
 * Internal dependencies
 */
import { useHistory } from '../../history';
import { getDataFromSessionStorage } from '../utils/sessionStore';
import getInitialStoryState from '../utils/getInitialStoryState';

// When ID is set, load story from API.
function useLoadStory({ storyId, shouldLoad, restore }) {
  const {
    actions: { clearHistory },
  } = useHistory();

  const storedStory = useCallback(() => {
    const sessionData = getDataFromSessionStorage();

    if (!sessionData?.pages || !sessionData?.pages[0]) {
      return null;
    }

    const { elements } = sessionData.pages[0];

    sessionData.pages[0].elements = elements.map((element) => {
      const { resource } = element;

      ['src', 'poster'].forEach((key) => {
        if (resource && key in resource && resource[key].startsWith('blob:')) {
          element.resource[key] = '';
        }
      });

      return element;
    });

    return sessionData;
  }, []);

  useEffect(() => {
    if (storyId && shouldLoad) {
      clearHistory();

      const sessionData = storedStory();
      const storyToRestore = sessionData ? sessionData : getInitialStoryState();

      restore(storyToRestore);
    }
  }, [storyId, shouldLoad, restore, clearHistory, storedStory]);
}

export default useLoadStory;
