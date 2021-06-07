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
import { useCallback, useRef } from 'react';
import getAllTemplates from '@web-stories-wp/templates';

/**
 * Internal dependencies
 */
import { useConfig } from '../config';
import Context from './context';
import removeImagesFromPageTemplates from './removeImagesFromPageTemplates';

function APIProvider({ children }) {
  const { cdnURL, assetsURL } = useConfig();

  // @todo All mocked fetch references need to be removed.
  const mockFetch = useCallback(() => Promise.resolve({}), []);

  const pageTemplates = useRef({
    base: [],
    withoutImages: [],
  });

  const getPageTemplates = useCallback(
    async ({ showImages = false } = {}) => {
      // check if pageTemplates have been loaded yet
      if (pageTemplates.current.base.length === 0) {
        pageTemplates.current.base = await getAllTemplates({ cdnURL });
        pageTemplates.current.withoutImages = removeImagesFromPageTemplates({
          templates: pageTemplates.current.base,
          assetsURL,
          showImages,
        });
      }

      return pageTemplates.current[showImages ? 'base' : 'withoutImages'];
    },
    [cdnURL, assetsURL]
  );

  const state = {
    actions: {
      autoSaveById: mockFetch,
      getStoryById: mockFetch,
      getDemoStoryById: mockFetch,
      getStoryLockById: mockFetch,
      setStoryLockById: mockFetch,
      deleteStoryLockById: mockFetch,
      getLinkMetadata: mockFetch,
      saveStoryById: mockFetch,
      getAuthors: mockFetch,
      uploadMedia: mockFetch,
      updateMedia: mockFetch,
      deleteMedia: mockFetch,
      saveMetaBoxes: mockFetch,
      getStatusCheck: mockFetch,
      addPageTemplate: mockFetch,
      getCustomPageTemplates: mockFetch,
      getPageTemplates,
      getCurrentUser: mockFetch,
      updateCurrentUser: mockFetch,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

APIProvider.propTypes = {
  children: PropTypes.node,
};

export default APIProvider;
