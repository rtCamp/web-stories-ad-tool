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
import { __, sprintf } from '@web-stories-wp/i18n';
import { v4 as uuidv4 } from 'uuid';
import { useConfig } from '../../config';
import { getResourceFromLocalFile } from '../utils';
import bytesToMB from '../utils/bytesToMB';
import usePersistentAssets from './usePersistentAssets';

/**
 * @typedef {import('./typedefs').LocalMediaContext} LocalMediaContext
 * @typedef {import('./typedefs').LocalMediaReducerState} LocalMediaReducerState
 * @typedef {import('./typedefs').LocalMediaReducerActions} LocalMediaReducerActions
 */

/**
 * Context fragment provider for local media.
 * This is called from {@link MediaProvider} to provide the media global state.
 *
 * @return {LocalMediaContext} Context.
 */
export default function useContextValueProvider() {
  const {
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      video: allowedVideoMimeTypes,
    },
    maxUpload,
  } = useConfig();

  const [media, updateMedia] = useState([]);
  const [uploadErrorMessages, updateUploadErrorMessages] = useState([]);

  const addLocalFiles = useCallback(
    async (files) => {
      const mediaItems = [...media];
      const allowedMimeTypes = [
        ...allowedImageMimeTypes,
        ...allowedVideoMimeTypes,
      ];

      const isValidFile = (file) => {
        let isValid = true;

        if (!allowedMimeTypes.includes(file.type)) {
          updateUploadErrorMessages([
            ...uploadErrorMessages,
            __('Invalid file type', 'web-stories'),
          ]);
          isValid = false;
        }

        if (file.size > maxUpload) {
          updateUploadErrorMessages([
            ...uploadErrorMessages,
            sprintf(
              /* translators: first %s is the file name, second %s is the file size in MB and second %s is the upload file limit in MB */
              __(
                '%1$s is %2$sMB and the upload limit is %3$sMB. Please resize and try again!',
                'web-stories'
              ),
              file.name,
              bytesToMB(file.size),
              bytesToMB(maxUpload)
            ),
          ]);
          isValid = false;
        }

        return isValid;
      };

      await Promise.all(
        [...files].map(async (file) => {
          if (isValidFile(file)) {
            const { resource: mediaData } = await getResourceFromLocalFile(
              file
            );
            mediaData.local = false; // this disables the UploadingIndicator
            mediaData.id = uuidv4();
            mediaData.file = file;
            mediaData.modifiedAt = new Date().getTime();
            mediaItems.push(mediaData);
          }
        })
      );

      updateMedia(mediaItems);
    },
    [
      allowedImageMimeTypes,
      allowedVideoMimeTypes,
      uploadErrorMessages,
      maxUpload,
      media,
      updateMedia,
      updateUploadErrorMessages,
    ]
  );

  usePersistentAssets({
    addLocalFiles,
    media,
  });

  const noop = useCallback(() => {}, []);

  return {
    state: {
      isUploading: false,
      isTranscoding: false,
      uploadErrorMessages,
      media,
    },
    actions: {
      setNextPage: noop,
      setMediaType: noop,
      setSearchTerm: noop,
      resetFilters: noop,
      uploadMedia: noop,
      resetWithFetch: noop,
      uploadVideoPoster: noop,
      deleteMediaElement: noop,
      updateMediaElement: noop,
      optimizeVideo: noop,
      updateMedia,
      addLocalFiles,
      updateUploadErrorMessages,
    },
  };
}
