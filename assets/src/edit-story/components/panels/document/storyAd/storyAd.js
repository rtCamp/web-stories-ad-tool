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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { __ } from '@web-stories-wp/i18n';
import { SimplePanel } from '../../panel';
import { DropDown, Input, PLACEMENT } from '../../../../../design-system';
import { Row } from '../../../form';
import useAdStory from '../../../../app/storyAd/useAdStory';
import {
  CTA_OPTIONS,
  LANDING_PAGE_OPTION,
} from '../../../../constants/storyAd';

const FieldRow = styled(Row)`
  margin-bottom: 12px;
`;

function StoryAdPanel() {
  const {
    actions: {
      updateCTALink,
      updateCtaText,
      updateCustomCtaText,
      updateLandingPageType,
    },
    state: { ctaLink, ctaText, customCtaText, landingPageType },
  } = useAdStory();

  const handleCTALinkChange = (event) => {
    updateCTALink(event.currentTarget.value);
  };

  const handleCustomCTAChange = (event) => {
    updateCustomCtaText(event.currentTarget.value);
  };

  return (
    <SimplePanel
      name="story-ad"
      title={__('Call To Action', 'web-stories')}
      collapsedByDefault={false}
    >
      <FieldRow>
        <Input
          value={ctaLink}
          onChange={handleCTALinkChange}
          placeholder={__('Enter CTA Link', 'web-stories')}
          aria-label={__('CTA Link', 'web-stories')}
        />
      </FieldRow>

      <FieldRow>
        <DropDown
          emptyText={__('No options available', 'web-stories')}
          options={CTA_OPTIONS}
          hasError={false}
          hint={''}
          placeholder={__('Select CTA Text', 'web-stories')}
          dropDownLabel={__('CTA Text', 'web-stories')}
          isKeepMenuOpenOnSelection={false}
          isRTL={false}
          selectedValue={ctaText}
          onMenuItemClick={(event, newValue) => {
            updateCtaText(newValue);
          }}
          placement={PLACEMENT.BOTTOM}
        />
      </FieldRow>

      {'CUSTOM_TEXT' === ctaText && (
        <FieldRow>
          <Input
            value={customCtaText}
            onChange={handleCustomCTAChange}
            placeholder={__('Enter Custom CTA Text', 'web-stories')}
            aria-label={__('Custom CTA Text', 'web-stories')}
          />
        </FieldRow>
      )}

      <FieldRow>
        <DropDown
          emptyText={__('No options available', 'web-stories')}
          options={LANDING_PAGE_OPTION}
          hasError={false}
          hint={''}
          placeholder={__('Select Landing Page Type', 'web-stories')}
          dropDownLabel={__('Landing Page Type', 'web-stories')}
          isKeepMenuOpenOnSelection={false}
          isRTL={false}
          selectedValue={landingPageType}
          onMenuItemClick={(event, newValue) => {
            updateLandingPageType(newValue);
          }}
          placement={PLACEMENT.BOTTOM}
        />
      </FieldRow>
    </SimplePanel>
  );
}

export default StoryAdPanel;
