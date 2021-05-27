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
import { useCallback, useEffect, useState } from 'react';
import { __ } from '@web-stories-wp/i18n';

/**
 * WordPress dependencies
 */
import { addQueryArgs } from '@wordpress/url';

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
  THEME_CONSTANTS,
  Text,
} from '../../../../design-system';
import Tooltip from '../../tooltip';
import getStoryPropsToSave from '../../../app/story/utils/getStoryPropsToSave';
import useAdStory from '../../../app/storyAd/useAdStory';
import getCurrentUrl from '../../../utils/getCurrentUrl';
import isBlobURL from '../../../utils/isBlobURL';
import { LOCAL_STORAGE_PREFIX } from '../../../utils/localStore';
import { PAGE_RATIO, PAGE_WIDTH } from '../../../constants';
import Dialog from '../../dialog';

const PREVIEW_TARGET = 'story-preview';

function Preview() {
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const {
    internal: { reducerState },
  } = useStory();
  const {
    state: { ctaLink, ctaText, customCtaText, landingPageType },
  } = useAdStory();

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

  const { content } = getStoryPropsToSave({
    story,
    pages,
    metadata: {},
    flags: {},
    storyAd: { ctaLink, ctaText, customCtaText, landingPageType },
  });

  const markup = `<!doctype html>${content}`;

  /**
   * Open a preview of the story.
   */
  const openPreviewLink = useCallback(() => {
    let previewMarkup = markup;

    pages.map((page) => {
      page.elements.map((element) => {
        if (element?.resource?.src.startsWith('https://images.unsplash.com')) {
          const src = element.resource.src;
          const resizedSrc = addQueryArgs(src, {
            w: PAGE_WIDTH * 2,
            h: (PAGE_WIDTH * 2) / PAGE_RATIO,
          });

          const markupSrc = src.replaceAll('&', '&amp;');
          previewMarkup = previewMarkup.replace(markupSrc, resizedSrc);
        }
      });
    });

    localStorage.setItem(LOCAL_STORAGE_PREFIX.PREVIEW_MARKUP, previewMarkup);

    window.open(getCurrentUrl() + 'preview', PREVIEW_TARGET);
  }, [markup, pages]);

  const handleOnPreviewClick = useCallback(() => {
    const { elements } = pages[0];
    let i = 0;
    let shoudShowTheDialog = false;

    for (i = 0; i < elements.length; i++) {
      const element = elements[i];

      // 1. Element is video and is set as background
      // 2. Element has local video
      if (
        element.type === 'video' &&
        (element.isBackground || isBlobURL(element?.resource?.src))
      ) {
        shoudShowTheDialog = true;
        break;
      }

      // 3. Element is external Gif and set as background
      if (element.type === 'gif' && element.isBackground) {
        shoudShowTheDialog = true;
        break;
      }
    }

    if (shoudShowTheDialog) {
      setShowPreviewDialog(true);
    } else {
      openPreviewLink();
    }
  }, [pages, openPreviewLink]);

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
        title={__('Stories Preview', 'web-stories')}
        primaryText={__('OK', 'web-stories')}
        onPrimary={closePreviewDialog}
      >
        <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {__(
            'Some of the elements in your story may not autoplay on preview. They will autoplay when the ad is a part of an actual Web Story.',
            'web-stories'
          )}
        </Text>
      </Dialog>
    </>
  );
}

export default Preview;
