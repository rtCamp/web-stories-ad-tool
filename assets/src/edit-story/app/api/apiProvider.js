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
import { useCallback } from 'react';

/**
 * Internal dependencies
 */
import Context from './context';

function APIProvider({ children }) {
  // @todo All mocked fetch references need to be removed.
  const mockedFetch = useCallback(() => Promise.resolve({}), []);

  const getStoryById = useCallback(() => {
    // @todo Remove items not required for story ad.
    return Promise.resolve({
      date: '',
      modified: '',
      password: '',
      slug: '',
      status: 'auto-draft',
      link: '',
      title: {
        raw: '',
      },
      excerpt: {
        raw: '',
      },
      permalink_template: '',
      story_data: [],
      publisher_logo_url: null,
      style_presets: {
        colors: [],
        textStyles: [],
      },
      featured_media_url: '',
      preview_link: '',
      _embedded: {},
    });
  }, []);

  // @todo To be removed.
  const getMedia = useCallback(
    () =>
      Promise.resolve({
        body: [],
        status: 200,
        headers: {
          'X-WP-Total': 12,
          'X-WP-TotalPages': 1,
        },
      }),
    []
  );

  const getCurrentUser = useCallback(() => {
    return Promise.resolve({
      id: 1,
      name: 'dev',
      url: '',
      description: '',
      link: '',
      slug: 'dev',
      avatar_urls: {
        24: '',
      },
      meta: {
        web_stories_tracking_optin: false,
        web_stories_media_optimization: true,
        web_stories_onboarding: {
          safeZone: true,
        },
      },
      amp_dev_tools_enabled: true,
      _links: {
        self: [
          {
            href: '',
          },
        ],
        collection: [
          {
            href: '',
          },
        ],
      },
    });
  }, []);

  /**
   * Status check, submit html string.
   *
   * @todo To be removed.
   *
   * @param {string} HTML string.
   * @return {Promise} Result promise
   */
  const getStatusCheck = useCallback(
    () => Promise.resolve({ success: true }),
    []
  );

  const state = {
    actions: {
      autoSaveById: mockedFetch,
      getStoryById,
      getDemoStoryById: mockedFetch,
      getStoryLockById: mockedFetch,
      setStoryLockById: mockedFetch,
      deleteStoryLockById: mockedFetch,
      getMedia,
      getLinkMetadata: mockedFetch,
      saveStoryById: mockedFetch,
      getAuthors: mockedFetch,
      uploadMedia: mockedFetch,
      updateMedia: mockedFetch,
      deleteMedia: mockedFetch,
      saveMetaBoxes: mockedFetch,
      getStatusCheck,
      addPageTemplate: mockedFetch,
      getCustomPageTemplates: mockedFetch,
      getPageTemplates: mockedFetch,
      getCurrentUser,
      updateCurrentUser: mockedFetch,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

APIProvider.propTypes = {
  children: PropTypes.node,
};

export default APIProvider;
