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
import { useState, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { __, sprintf } from '@web-stories-wp/i18n';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import Dialog from '../../components/dialog';
import { THEME_CONSTANTS, Text, useSnackbar } from '../../../design-system';
import { useConfig, useStory } from '..';
import { useMedia } from '../media';
import { getResourceFromLocalFile } from '../media/utils';
import useFFmpeg from '../media/utils/useFFmpeg';
import Context from './context';

const bytesToMB = (bytes) =>
  (bytes / Math.pow(1024, 2)).toFixed(2).replace(/\.00$/, '');

function LocalFileProvider({ children }) {
  const { transcodeVideo } = useFFmpeg();
  const { showSnackbar } = useSnackbar();
  const [errorMessages, setErrorMessages] = useState([]);
  const [currentElementCount, setCurrentElementCount] = useState(0);
  const [optimizationMessage, setOptimizationMessage] = useState('');
  const [resourceToBeOptimized, setResourceToBeOptimized] = useState({});

  const {
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      video: allowedVideoMimeTypes,
    },
    maxUpload,
    maxVideoFileSize,
  } = useConfig();

  const allowedMimeTypes = useMemo(
    () => [...allowedImageMimeTypes, ...allowedVideoMimeTypes],
    [allowedImageMimeTypes, allowedVideoMimeTypes]
  );

  const { localStoryAdMedia: media, setLocalStoryAdMedia } = useMedia(
    ({
      local: {
        state: { localStoryAdMedia },
        actions: { setLocalStoryAdMedia },
      },
    }) => ({
      localStoryAdMedia,
      setLocalStoryAdMedia,
    })
  );

  const { elements, elementCount, updateElementsByResourceId } = useStory(
    (state) => ({
      elements: state.state.pages?.[0]?.elements,
      elementCount: state.state.pages?.[0]?.elements?.length,
      updateElementsByResourceId: state.actions.updateElementsByResourceId,
    })
  );

  useEffect(() => {
    if (currentElementCount < elementCount) {
      const newElementIndex = elementCount - 1;
      const resource = elements[newElementIndex].resource;

      if (
        resource?.type === 'video' &&
        resource?.file?.size > maxVideoFileSize
      ) {
        setResourceToBeOptimized(resource);
        setOptimizationMessage(
          sprintf(
            /* translators: %s resource file name. */
            __(
              '"%s" is larger than 1MB. Do you want to optimize this video?',
              'web-stories'
            ),
            resource.title
          )
        );
      }
    }

    setCurrentElementCount(elementCount);
  }, [elements, elementCount, currentElementCount, maxVideoFileSize]);

  const addLocalFiles = useCallback(
    async (files) => {
      const mediaItems = [...media];

      const isValidFile = (file) => {
        let isValid = true;

        if (!allowedMimeTypes.includes(file.type)) {
          setErrorMessages([
            ...errorMessages,
            __('Invalid file type', 'web-stories'),
          ]);
          isValid = false;
        }

        if (file.size > maxUpload) {
          setErrorMessages([
            ...errorMessages,
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
            const mediaData = await getResourceFromLocalFile(file);
            mediaData.local = false; // this disables the UploadingIndicator
            mediaData.id = uuidv4();
            mediaData.file = file;
            mediaData.modifiedAt = new Date().getTime();
            mediaItems.push(mediaData);
          }
        })
      );

      setLocalStoryAdMedia(mediaItems);
    },
    [allowedMimeTypes, errorMessages, maxUpload, media, setLocalStoryAdMedia]
  );

  const closeErrorDialog = () => {
    setErrorMessages([]);
  };

  const closeOptimizationDialog = () => {
    setResourceToBeOptimized({});
    setOptimizationMessage('');
  };

  const setMediaElementAsLocal = (id) => {
    const mediaElements = [...media];
    const index = mediaElements.findIndex((mediaItem) => mediaItem.id === id);
    mediaElements[index].local = true;
    mediaElements[index].isTranscoding = true;
    mediaElements[index].modifiedAt = new Date().getTime();
    setLocalStoryAdMedia(mediaElements);
  };

  const setOptimizedVideoInGallery = async (id, optimizedFile) => {
    const mediaElements = [...media];
    const index = mediaElements.findIndex((mediaItem) => mediaItem.id === id);
    const currentMediaData = { ...mediaElements[index] };

    const mediaData = await getResourceFromLocalFile(optimizedFile);
    mediaData.local = false;
    mediaData.id = currentMediaData.id;
    mediaData.file = optimizedFile;
    mediaData.isTranscoding = false;
    mediaData.modifiedAt = new Date().getTime();

    mediaElements[index] = mediaData;
    setLocalStoryAdMedia(mediaElements);

    const updateResource = {
      id: mediaData.id,
      properties: ({ resource, ...rest }) => ({
        ...rest,
        resource: mediaData,
      }),
    };

    updateElementsByResourceId(updateResource);

    if (mediaData.file.size > maxVideoFileSize) {
      const message = sprintf(
        /* translators: %s resource file size. */
        __(
          'The size of the video after optimisation is %s which is still more than 1MB, you may want to use smaller video size.',
          'web-stories'
        ),
        bytesToMB(mediaData.file.size)
      );

      showSnackbar({
        message,
        dismissable: true,
      });
    }
  };

  const startOptimization = async () => {
    const resource = { ...resourceToBeOptimized };
    closeOptimizationDialog();

    showSnackbar({
      message: __('Video optimization in progress.', 'web-stories'),
      dismissable: true,
    });

    setMediaElementAsLocal(resource.id);

    const optimizedFile = await transcodeVideo(resource.file);
    setOptimizedVideoInGallery(resource.id, optimizedFile);
  };

  const state = {
    state: {
      media,
    },
    actions: {
      addLocalFiles,
    },
  };

  return (
    <Context.Provider value={state}>
      {children}
      <Dialog
        open={errorMessages.length > 0}
        onClose={closeErrorDialog}
        title={__('Error uploading file', 'web-stories')}
        primaryText={__('Close', 'web-stories')}
        onPrimary={closeErrorDialog}
      >
        {errorMessages.map((message) => (
          <Text
            key={message}
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
          >
            {message}
          </Text>
        ))}
      </Dialog>
      <Dialog
        open={optimizationMessage.length > 0}
        onClose={closeOptimizationDialog}
        title={__('Optimize video size', 'web-stories')}
        secondaryText={__('No, skip it', 'web-stories')}
        onSecondary={closeOptimizationDialog}
        primaryText={__('Yes, Optimize it', 'web-stories')}
        onPrimary={startOptimization}
      >
        <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {optimizationMessage}
        </Text>
      </Dialog>
    </Context.Provider>
  );
}

LocalFileProvider.propTypes = {
  children: PropTypes.node,
};

export default LocalFileProvider;
