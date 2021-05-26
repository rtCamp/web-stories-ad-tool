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
import { useCallback, useState } from 'react';

/**
 * Internal dependencies
 */
import useUploadMedia from '../useUploadMedia';

/**
 * @typedef {import('./typedefs').LocalMediaContext} LocalMediaContext
 * @typedef {import('./typedefs').LocalMediaReducerState} LocalMediaReducerState
 * @typedef {import('./typedefs').LocalMediaReducerActions} LocalMediaReducerActions
 */

/**
 * Context fragment provider for local media.
 * This is called from {@link MediaProvider} to provide the media global state.
 *
 * @param {LocalMediaReducerState} reducerState The 'local' fragment of the
 * state returned from `useMediaReducer`
 * @param {LocalMediaReducerActions} reducerActions The 'local' fragment of the
 * actions returned from `useMediaReducer`
 * @return {LocalMediaContext} Context.
 */
export default function useContextValueProvider(reducerState, reducerActions) {
  const { media } = reducerState;
  const {
    prependMedia,
    updateMediaElement,
    deleteMediaElement,
  } = reducerActions;

  const [localStoryAdMedia, setLocalStoryAdMedia] = useState([]);

  const { uploadMedia, isUploading, isTranscoding } = useUploadMedia({
    media,
    prependMedia,
    updateMediaElement,
    deleteMediaElement,
  });

  const noop = useCallback(() => {}, []);

  return {
    state: {
      ...reducerState,
      isUploading,
      isTranscoding,
      localStoryAdMedia,
    },
    actions: {
      setNextPage: noop,
      setMediaType: noop,
      setSearchTerm: noop,
      resetFilters: noop,
      uploadMedia,
      resetWithFetch: noop,
      uploadVideoPoster: noop,
      deleteMediaElement: noop,
      updateMediaElement: noop,
      optimizeVideo: noop,
      setLocalStoryAdMedia,
    },
  };
}
