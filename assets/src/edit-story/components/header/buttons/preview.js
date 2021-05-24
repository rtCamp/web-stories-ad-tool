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
import { useCallback, useEffect } from 'react';
import { __ } from '@web-stories-wp/i18n';

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
} from '../../../../design-system';
import Tooltip from '../../tooltip';
import getStoryPropsToSave from '../../../app/story/utils/getStoryPropsToSave';
import useAdStory from '../../../app/storyAd/useAdStory';
import getCurrentUrl from '../../../utils/getCurrentUrl';
import { LOCAL_STORAGE_PREFIX } from '../../../utils/localStore';

const PREVIEW_TARGET = 'story-preview';

function Preview() {
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
    localStorage.setItem(LOCAL_STORAGE_PREFIX.PREVIEW_MARKUP, markup);

    window.open(getCurrentUrl() + 'preview', PREVIEW_TARGET);
  }, [markup]);

  const label = __('Preview', 'web-stories');

  return (
    <Tooltip title={label} hasTail>
      <Button
        variant={BUTTON_VARIANTS.SQUARE}
        type={BUTTON_TYPES.QUATERNARY}
        size={BUTTON_SIZES.SMALL}
        onClick={openPreviewLink}
        disabled={false}
        aria-label={label}
      >
        <Icons.Eye />
      </Button>
    </Tooltip>
  );
}

export default Preview;
