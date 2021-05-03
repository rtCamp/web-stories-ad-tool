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

/**
 * Internal dependencies
 */
import {
  Text,
  THEME_CONSTANTS,
  useSnackbar,
} from '../../../../../../design-system';
import { useLocalMedia, useMedia } from '../../../../../app/media';
import { useStory } from '../../../../../app/story';
import Dialog from '../../../../dialog';

/**
 * Display a confirmation dialog for when a user wants to delete a media element.
 *
 * @param {Object} props Component props.
 * @param {number} props.mediaId Selected media element's ID.
 * @param {string} props.type Selected media element's type.
 * @param {function()} props.onClose Callback to toggle dialog display on close.
 * @return {null|*} The dialog element.
 */
function DeleteDialog({ mediaId, type, onClose }) {
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

  const deleteMedia = useCallback(
    (id) => {
      const currentMediaIndex = media.findIndex(
        (mediaItem) => id === mediaItem?.id
      );
      const newMedia = [...media];

      if (currentMediaIndex > -1) {
        newMedia.splice(currentMediaIndex, 1);
        setLocalStoryAdMedia(newMedia);
      }
    },
    [media, setLocalStoryAdMedia]
  );

  const { showSnackbar } = useSnackbar();
  const { deleteMediaElement } = useLocalMedia((state) => ({
    deleteMediaElement: state.actions.deleteMediaElement,
  }));
  const { deleteElementsByResourceId } = useStory((state) => ({
    deleteElementsByResourceId: state.actions.deleteElementsByResourceId,
  }));

  const onDelete = useCallback(async () => {
    onClose();
    try {
      await deleteMedia(mediaId);
      deleteMediaElement({ id: mediaId });
      deleteElementsByResourceId({ id: mediaId });
    } catch (err) {
      showSnackbar({
        message: __('Failed to delete media item.', 'web-stories'),
        dismissable: true,
      });
    }
  }, [
    deleteMedia,
    deleteMediaElement,
    deleteElementsByResourceId,
    mediaId,
    onClose,
    showSnackbar,
  ]);

  const imageDialogTitle = __('Delete Image?', 'web-stories');
  const videoDialogTitle = __('Delete Video?', 'web-stories');
  const imageDialogDescription = __(
    'You are about to delete this image',
    'web-stories'
  );
  const videoDialogDescription = __(
    'You are about to permanently delete this video from your site. ' +
      'The video will appear broken in any WordPress content that uses it. ',
    'web-stories'
  );

  // Keep icon and menu displayed if menu is open (even if user's mouse leaves the area).
  return (
    <Dialog
      open
      onClose={onClose}
      title={type === 'image' ? imageDialogTitle : videoDialogTitle}
      secondaryText={__('Cancel', 'web-stories')}
      onPrimary={onDelete}
      primaryText={__('Delete', 'web-stories')}
      maxWidth={512}
    >
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {type === 'image' ? imageDialogDescription : videoDialogDescription}
      </Text>
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL} isBold>
        {__('This action can not be undone.', 'web-stories')}
      </Text>
    </Dialog>
  );
}

DeleteDialog.propTypes = {
  mediaId: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DeleteDialog;
