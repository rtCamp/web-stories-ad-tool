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
import { useCallback, useMemo, useState } from 'react';
import queryString from 'query-string';

/**
 * Internal dependencies
 */
import { STORIES_PER_REQUEST } from '../../../dashboard/constants';

export default function useUserApi(dataAdapter, { currentUserApi }) {
  const [currentUser, setCurrentUser] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [authorSuggestions, setAuthorSuggestions] = useState([]);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setCurrentUser(await dataAdapter.get(currentUserApi));
    } catch (e) {
      setCurrentUser({});
    }
  }, [dataAdapter, currentUserApi]);

  const toggleWebStoriesTrackingOptIn = useCallback(async () => {
    setIsUpdating(true);
    try {
      setCurrentUser(
        await dataAdapter.post(currentUserApi, {
          data: {
            meta: {
              web_stories_tracking_optin: !currentUser.meta
                .web_stories_tracking_optin,
            },
          },
        })
      );
    } finally {
      setIsUpdating(false);
    }
  }, [dataAdapter, currentUser, currentUserApi]);

  const fetchAuthors = useCallback(
    async ({ searchTerm, page = 1, perPage = STORIES_PER_REQUEST }) => {
      const query = {
        context: 'edit',
        search: searchTerm || undefined,
        page,
        per_page: perPage,
      };

      try {
        const path = queryString.stringifyUrl({
          url: '/web-stories/v1/users/',
          query,
        });

        setAuthorSuggestions(await dataAdapter.get(path));
      } catch (e) {
        setAuthorSuggestions([]);
      }
    },
    [dataAdapter]
  );

  return useMemo(
    () => ({
      api: { fetchCurrentUser, toggleWebStoriesTrackingOptIn, fetchAuthors },
      currentUser: { data: currentUser, isUpdating },
      authorSuggestions: authorSuggestions,
    }),
    [
      fetchCurrentUser,
      toggleWebStoriesTrackingOptIn,
      currentUser,
      isUpdating,
      fetchAuthors,
      authorSuggestions,
    ]
  );
}
