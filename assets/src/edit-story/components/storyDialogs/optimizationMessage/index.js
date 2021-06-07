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
 * Internal dependencies
 */
/**
 * External dependencies
 */
import { __, sprintf } from '@web-stories-wp/i18n';
import { useCallback, useEffect, useState } from 'react';
import Dialog from '../../dialog';
/**
 * External dependencies
 */
import { Text, THEME_CONSTANTS, useSnackbar } from '../../../../design-system';
import useFFmpeg from '../../../app/media/utils/useFFmpeg';
import { useConfig, useMedia, useStory } from '../../../app';
import { getResourceFromLocalFile } from '../../../app/media/utils';
import bytesToMB from '../../../app/media/utils/bytesToMB';

function OptimisationMessage() {
  const { transcodeVideo } = useFFmpeg();
  const { showSnackbar } = useSnackbar();
  const [currentElementCount, setCurrentElementCount] = useState(0);
  const [optimizationMessage, setOptimizationMessage] = useState('');
  const [resourceToBeOptimized, setResourceToBeOptimized] = useState({});

  const { maxVideoFileSize } = useConfig();

  const { media, updateMedia } = useMedia(
    ({
      local: {
        state: { media },
        actions: { updateMedia },
      },
    }) => ({
      media,
      updateMedia,
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

  const closeOptimizationDialog = () => {
    setResourceToBeOptimized({});
    setOptimizationMessage('');
  };

  const setMediaElementAsLocal = useCallback(
    (id) => {
      const mediaElements = [...media];
      const index = mediaElements.findIndex((mediaItem) => mediaItem.id === id);
      mediaElements[index].local = true;
      mediaElements[index].isTranscoding = true;
      mediaElements[index].modifiedAt = new Date().getTime();
      updateMedia(mediaElements);
    },
    [media, updateMedia]
  );

  const setOptimizedVideoInGallery = useCallback(
    async (id, optimizedFile) => {
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
      updateMedia(mediaElements);

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
        });
      }
    },
    [
      maxVideoFileSize,
      media,
      showSnackbar,
      updateElementsByResourceId,
      updateMedia,
    ]
  );

  const startOptimization = useCallback(async () => {
    const resource = { ...resourceToBeOptimized };
    closeOptimizationDialog();

    showSnackbar({
      message: __('Video optimization in progress.', 'web-stories'),
    });

    setMediaElementAsLocal(resource.id);

    const optimizedFile = await transcodeVideo(resource.file);
    await setOptimizedVideoInGallery(resource.id, optimizedFile);
  }, [
    resourceToBeOptimized,
    setMediaElementAsLocal,
    setOptimizedVideoInGallery,
    showSnackbar,
    transcodeVideo,
  ]);

  return (
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
  );
}

export default OptimisationMessage;
