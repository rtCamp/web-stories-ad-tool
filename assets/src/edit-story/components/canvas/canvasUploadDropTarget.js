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
import { __ } from '@web-stories-wp/i18n';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import {
  UploadDropTarget,
  UploadDropTargetMessage,
  UploadDropTargetOverlay,
} from '../uploadDropTarget';
import { useMedia, useStory } from '../../app';

import { getResourceFromLocalFile } from '../../app/media/utils';
import { Layer as CanvasLayer, PageArea } from './layout';

const MESSAGE_ID = 'edit-story-canvas-upload-message';

function CanvasUploadDropTarget({ children }) {
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
  const { addElements, currentPage } = useStory(
    ({
      state: { currentPage, selectedElementIds },
      actions: { addElements },
    }) => {
      return {
        currentPage,
        selectedElementIds,
        addElements,
      };
    }
  );
  const elements = currentPage?.elements;

  const onDropHandler = useCallback(
    async (files) => {
      const mediaItems = [...media];
      const elementsArray = [...elements];
      await Promise.all(
        files.map(async (file) => {
          const mediaData = await getResourceFromLocalFile(file);
          mediaData.local = false; // this disables the UploadingIndicator

          mediaData.id = uuidv4();
          const element = {
            focalX: 0,
            focalY: 0,
            opacity: 100,
            id: mediaData.id,
            resource: mediaData,
            rotationAngle: 0,
            scale: 50,
            x: 0,
            y: 0,
            type: mediaData.type,
            width: mediaData.width / 2,
            height: mediaData.height / 2,
          };

          mediaItems.push(mediaData);
          elementsArray.push(element);
        })
      );

      addElements({ elements: elementsArray });

      setLocalStoryAdMedia(mediaItems);
    },
    [media, setLocalStoryAdMedia, addElements, elements]
  );
  return (
    <UploadDropTarget onDrop={onDropHandler} labelledBy={MESSAGE_ID}>
      {children}
      <UploadDropTargetOverlay>
        <CanvasLayer>
          <PageArea
            overlay={
              <UploadDropTargetMessage
                id={MESSAGE_ID}
                message={__(
                  'Upload to media library and add to the page.',
                  'web-stories'
                )}
              />
            }
          />
        </CanvasLayer>
      </UploadDropTargetOverlay>
    </UploadDropTarget>
  );
}

CanvasUploadDropTarget.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CanvasUploadDropTarget;
