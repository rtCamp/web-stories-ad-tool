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
import { useCallback, useEffect, useRef, useState } from 'react';
import { __ } from '@web-stories-wp/i18n';

/**
 * WordPress dependencies
 */
/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  Text,
  THEME_CONSTANTS,
} from '../../../../design-system';
import Tooltip from '../../tooltip';
import getStoryPropsToSave from '../../../app/story/utils/getStoryPropsToSave';
import getCurrentUrl from '../../../utils/getCurrentUrl';
import isBlobURL from '../../../utils/isBlobURL';
import { LOCAL_STORAGE_PREFIX } from '../../../utils/localStore';
import Dialog from '../../dialog';

const PREVIEW_TARGET = 'story-preview';

function Preview() {
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const previewDialogShown = useRef(false);
  const {
    internal: { reducerState },
  } = useStory();

  const { pages, story } = reducerState;

  const onUnload = () => {
    localStorage.removeItem(LOCAL_STORAGE_PREFIX.PREVIEW_MARKUP);
  };

  useEffect(() => {
    window.addEventListener('beforeunload', onUnload);
    return () => {
      window.removeEventListener('beforeunload', onUnload);
    };
  }, []);

  /**
   * Open a preview of the story.
   */
  const openPreviewLink = useCallback(() => {
    const { content } = getStoryPropsToSave({
      story,
      pages,
      metadata: {},
      flags: {},
      isPreview: true,
    });

    const markup = `<!doctype html>${content}`;

    localStorage.setItem(LOCAL_STORAGE_PREFIX.PREVIEW_MARKUP, markup);
    window.open(getCurrentUrl() + 'preview', PREVIEW_TARGET);
  }, [story, pages]);

  const handleOnPreviewClick = useCallback(
    (event) => {
      const { elements } = pages[0];
      let caShowTheDialog = false;

      event.preventDefault();

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        // 1. Element is video and is set as background
        // 2. Element has local video
        if (
          'video' === element.type &&
          (element.isBackground || isBlobURL(element?.resource?.src))
        ) {
          caShowTheDialog = true;
          break;
        }

        // 3. Element is external Gif and set as background
        if (element.type === 'gif' && element.isBackground) {
          caShowTheDialog = true;
          break;
        }
      }

      if (caShowTheDialog && false === previewDialogShown.current) {
        setShowPreviewDialog(true);
        previewDialogShown.current = true;
      } else {
        openPreviewLink();
      }
    },
    [pages, openPreviewLink]
  );

  const closePreviewDialog = () => {
    setShowPreviewDialog(false);
    openPreviewLink();
  };

  const label = __('Preview', 'web-stories');

  return (
    <>
      <Tooltip title={label} hasTail>
        <Button
          variant={BUTTON_VARIANTS.SQUARE}
          type={BUTTON_TYPES.QUATERNARY}
          size={BUTTON_SIZES.SMALL}
          onClick={handleOnPreviewClick}
          disabled={false}
          aria-label={label}
        >
          <Icons.Eye />
        </Button>
      </Tooltip>
      <Dialog
        open={showPreviewDialog}
        onClose={closePreviewDialog}
        title={null}
        primaryText={__('OK', 'web-stories')}
        onPrimary={closePreviewDialog}
      >
        <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {__(
            'Video and gif elements may not autoplay in the preview however they should autoplay when the ad is part of an actual Web Story.',
            'web-stories'
          )}
        </Text>
      </Dialog>
    </>
  );
}

export default Preview;
