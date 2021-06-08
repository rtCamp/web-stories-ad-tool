/*
 * Copyright 2021 Google LLC
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
import { useCallback, useState } from 'react';

/**
 * Internal dependencies
 */
import { useAPI } from '../api';
import Context from './context';

function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({});
  const {
    actions: { updateCurrentUser: _updateCurrentUser },
  } = useAPI();

  const updateCurrentUser = useCallback(
    (data) => _updateCurrentUser(data).then(setCurrentUser),
    [_updateCurrentUser]
  );

  const toggleWebStoriesMediaOptimization = useCallback(() => {
    return updateCurrentUser({
      meta: {
        web_stories_media_optimization:
          !currentUser.meta.web_stories_media_optimization,
      },
    });
  }, [currentUser, updateCurrentUser]);

  const state = {
    state: {
      currentUser,
    },
    actions: {
      toggleWebStoriesMediaOptimization,
      updateCurrentUser,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

CurrentUserProvider.propTypes = {
  children: PropTypes.node,
};

export default CurrentUserProvider;
