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
import { __ } from '@web-stories-wp/i18n';
import Dialog from '../../dialog';
/**
 * External dependencies
 */
import { Text, THEME_CONSTANTS } from '../../../../design-system';
import { useMedia } from '../../../app';

function UploadError() {
  const { uploadErrorMessages, updateUploadErrorMessages } = useMedia(
    (state) => ({
      uploadErrorMessages: state.local.state.uploadErrorMessages,
      updateUploadErrorMessages: state.local.actions.updateUploadErrorMessages,
    })
  );

  const closeErrorDialog = () => {
    updateUploadErrorMessages([]);
  };

  return (
    <Dialog
      open={uploadErrorMessages.length > 0}
      onClose={closeErrorDialog}
      title={__('Error uploading file', 'web-stories')}
      primaryText={__('Close', 'web-stories')}
      onPrimary={closeErrorDialog}
    >
      {uploadErrorMessages.map((message) => (
        <Text
          key={message}
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
        >
          {message}
        </Text>
      ))}
    </Dialog>
  );
}

export default UploadError;
