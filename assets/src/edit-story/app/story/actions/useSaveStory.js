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
import { __ } from '@web-stories-wp/i18n';
import { useCallback, useState } from 'react';
import { useFeatures } from 'flagged';

/**
 * Internal dependencies
 */
import objectPick from '../../../utils/objectPick';
import { useAPI } from '../../api';
import { useConfig } from '../../config';
import { useSnackbar } from '../../../../design-system';
import getStoryPropsToSave from '../utils/getStoryPropsToSave';
import { useHistory } from '../../history';

/**
 * Custom hook to save story.
 *
 * @param {Object} properties Properties to update.
 * @param {number} properties.storyId Story post id.
 * @param {Array} properties.pages Array of all pages.
 * @param {Object} properties.story Story-global properties.
 * @param {Function} properties.updateStory Function to update a story.
 * @return {Function} Function that can be called to save a story.
 */
function useSaveStory({ storyId, pages, story, updateStory }) {
  const {
    actions: { saveStoryById },
  } = useAPI();
  const {
    actions: { resetNewChanges },
  } = useHistory();
  const flags = useFeatures();
  const { metadata } = useConfig();
  const { showSnackbar } = useSnackbar();
  const [isSaving, setIsSaving] = useState(false);

  const saveStory = useCallback(
    (props) => {
      setIsSaving(true);

      return saveStoryById({
        storyId,
        ...getStoryPropsToSave({ story, pages, metadata, flags }),
        ...props,
      })
        .then((post) => {
          const properties = {
            ...objectPick(post, ['status', 'slug', 'link']),
            featuredMediaUrl: post.featured_media_url,
            previewLink: post.preview_link,
          };
          updateStory({ properties });
        })
        .catch(() => {
          showSnackbar({
            message: __('Failed to save the story', 'web-stories'),
            dismissable: true,
          });
        })
        .finally(() => {
          setIsSaving(false);
          resetNewChanges();
        });
    },
    [
      story,
      pages,
      flags,
      metadata,
      saveStoryById,
      storyId,
      updateStory,
      showSnackbar,
      resetNewChanges,
    ]
  );

  return { saveStory, isSaving, isFreshlyPublished: false };
}

export default useSaveStory;
