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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useStory, useMedia } from '../../../app';
import { removeSessionStorage } from '../../../app/story/utils/sessionStore';
import { createPage } from '../../../elements';

import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '../../../../design-system';
import useAdStory from '../../../app/storyAd/useAdStory';

const Space = styled.div`
  width: 8px;
`;

function Reset() {
  const {
    internal: { restore },
  } = useStory();

  const { setLocalStoryAdMedia } = useMedia(
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

  const {
    actions: {
      updateCTALink,
      updateCtaText,
      updateCustomCtaText,
      updateLandingPageType,
    },
  } = useAdStory();

  /**
   * Reset story handler.
   */
  const resetStory = () => {
    const stateToReset = {
      current: null,
      pages: [createPage()],
      selection: [],
      story: {},
    };

    // Remove local media items.
    setLocalStoryAdMedia([]);

    // Remove session storage dara.
    removeSessionStorage();

    // Update states
    updateCTALink('');
    updateCtaText('BOOK_NOW');
    updateCustomCtaText('');
    updateLandingPageType('AMP');

    restore(stateToReset);
  };

  const label = __('Reset', 'web-stories');

  return (
    <>
      <Space />
      <Button
        variant={BUTTON_VARIANTS.RECTANGLE}
        type={BUTTON_TYPES.SECONDARY}
        size={BUTTON_SIZES.SMALL}
        onClick={resetStory}
        disabled={false}
        aria-label={label}
      >
        {label}
      </Button>
    </>
  );
}

export default Reset;
