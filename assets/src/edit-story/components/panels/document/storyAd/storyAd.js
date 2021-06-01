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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { SimplePanel } from '../../panel';
import { DropDown, Input, PLACEMENT } from '../../../../../design-system';
import { Row } from '../../../form';
import { useStory } from '../../../../app';
import {
  CTA_OPTIONS,
  LANDING_PAGE_OPTIONS,
} from '../../../../constants/storyAd';

const FieldRow = styled(Row)`
  margin-bottom: 12px;
`;

function StoryAdPanel() {
  const { adOptions, updateAdOptions } = useStory(
    ({
      state: {
        story: { adOptions },
      },
      actions: { updateAdOptions },
    }) => ({ adOptions, updateAdOptions })
  );

  if (!adOptions) {
    return null;
  }

  const handleCTALinkChange = (event) => {
    updateAdOptions({ properties: { ctaLink: event.currentTarget.value } });
  };

  const handleCustomCTAChange = (event) => {
    updateAdOptions({
      properties: { customCtaText: event.currentTarget.value },
    });
  };

  return (
    <SimplePanel
      name="story-ad"
      title={__('Call To Action', 'web-stories')}
      collapsedByDefault={false}
    >
      <FieldRow>
        <Input
          value={adOptions.ctaLink}
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
          selectedValue={adOptions.ctaText}
          onMenuItemClick={(event, newValue) => {
            updateAdOptions({ properties: { ctaText: newValue } });
          }}
          placement={PLACEMENT.BOTTOM}
        />
      </FieldRow>

      {'CUSTOM_TEXT' === adOptions.ctaText && (
        <FieldRow>
          <Input
            value={adOptions.customCtaText}
            onChange={handleCustomCTAChange}
            placeholder={__('Enter Custom CTA Text', 'web-stories')}
            aria-label={__('Custom CTA Text', 'web-stories')}
          />
        </FieldRow>
      )}

      <FieldRow>
        <DropDown
          emptyText={__('No options available', 'web-stories')}
          options={LANDING_PAGE_OPTIONS}
          hasError={false}
          hint={''}
          placeholder={__('Select Landing Page Type', 'web-stories')}
          dropDownLabel={__('Landing Page Type', 'web-stories')}
          isKeepMenuOpenOnSelection={false}
          isRTL={false}
          selectedValue={adOptions.landingPageType}
          onMenuItemClick={(event, newValue) => {
            updateAdOptions({ properties: { landingPageType: newValue } });
          }}
          placement={PLACEMENT.BOTTOM}
        />
      </FieldRow>
    </SimplePanel>
  );
}

export default StoryAdPanel;
