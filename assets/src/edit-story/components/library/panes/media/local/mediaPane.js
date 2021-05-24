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
import { useRef, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { __, sprintf } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  THEME_CONSTANTS,
  Text,
} from '../../../../../../design-system';
import {
  MediaGalleryMessage,
  PaneHeader as DefaultPaneHeader,
  PaneInner,
  StyledPane,
} from '../common/styles';
import { PANE_PADDING } from '../../shared';
import PaginatedMediaGallery from '../common/paginatedMediaGallery';
import resourceList from '../../../../../utils/resourceList';
import useLibrary from '../../../useLibrary';
import getResourceFromLocalFile from '../../../../../app/media/utils/getResourceFromLocalFile';
import { useConfig, useMedia } from '../../../../../app';
import Dialog from '../../../../dialog';
import paneId from './paneId';

export const ROOT_MARGIN = 300;

const FilterArea = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 ${PANE_PADDING} 0 ${PANE_PADDING};
`;

const PaneHeader = styled(DefaultPaneHeader)`
  padding: ${PANE_PADDING} 0 ${PANE_PADDING} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const bytesToMB = (bytes) => Math.round(bytes / Math.pow(1024, 2));

function MediaPane(props) {
  const fileInputRef = useRef();
  const setNextPage = () => {};

  const [errorMessages, setErrorMessages] = useState([]);

  const {
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      video: allowedVideoMimeTypes,
    },
    maxUpload,
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

  const handleFileInput = async (event) => {
    if (!event.target.files.length) {
      return;
    }

    const { files } = event.target;

    const mediaItems = [...media];

    await Promise.all(
      [...files].map(async (file) => {
        if (isValidFile(file)) {
          const mediaData = await getResourceFromLocalFile(file);
          mediaData.local = false; // this disables the UploadingIndicator
          mediaItems.push(mediaData);
        }
      })
    );

    setLocalStoryAdMedia(mediaItems);
    fileInputRef.current.value = '';
  };

  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  /**
   * Insert element such image, video and audio into the editor.
   *
   * @param {Object} resource Resource object
   * @return {null|*} Return onInsert or null.
   */
  const insertMediaElement = useCallback(
    (resource, thumbnailURL) => {
      resourceList.set(resource.id, {
        url: thumbnailURL,
        type: 'cached',
      });
      insertElement(resource.type, { resource });
    },
    [insertElement]
  );

  const closeDialog = () => {
    setErrorMessages([]);
  };

  return (
    <StyledPane id={paneId} {...props}>
      <PaneInner>
        <PaneHeader>
          <FilterArea>
            <input
              type="file"
              accept={allowedMimeTypes}
              ref={fileInputRef}
              onChange={handleFileInput}
              hidden
              multiple
            />
            <Button
              variant={BUTTON_VARIANTS.RECTANGLE}
              type={BUTTON_TYPES.SECONDARY}
              size={BUTTON_SIZES.SMALL}
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
            >
              {__('Upload', 'web-stories')}
            </Button>
          </FilterArea>
        </PaneHeader>

        {!media.length ? (
          <MediaGalleryMessage>
            {__('No media found', 'web-stories')}
          </MediaGalleryMessage>
        ) : (
          <PaginatedMediaGallery
            providerType="local"
            resources={media}
            isMediaLoading={false}
            isMediaLoaded
            hasMore={false}
            onInsert={insertMediaElement}
            setNextPage={setNextPage}
            searchTerm={''}
          />
        )}
      </PaneInner>
      <Dialog
        open={errorMessages.length > 0}
        onClose={closeDialog}
        title={__('Error uploading file', 'web-stories')}
        primaryText={__('Close', 'web-stories')}
        onPrimary={closeDialog}
      >
        {errorMessages.map((message, index) => (
          <Text
            key={index}
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
          >
            {message}
          </Text>
        ))}
      </Dialog>
    </StyledPane>
  );
}

export default MediaPane;
