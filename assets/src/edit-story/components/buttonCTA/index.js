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
 * External dependencies
 */
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { isURL } from '@wordpress/url';

/**
 * Internal dependencies
 */
import useAdStory from '../../app/storyAd/useAdStory';
import { CTA_OPTIONS } from '../../constants/storyAd';

// Copied style from the original cta button.
const Link = styled.a`
  background-color: #fff;
  border-radius: 20px;
  box-sizing: border-box;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.16);
  color: #4285f4;
  font-family: sans-serif;
  font-weight: 700;
  font-size: 14px;
  height: 36px;
  letter-spacing: 0.2px;
  line-height: 36px;
  overflow: hidden;
  padding: 0 10px;
  text-align: center;
  text-decoration: none;
  min-width: 120px;
  max-width: calc(100vw - 64px);
  z-index: 99999;
  position: absolute;
  bottom: 32px;
`;

function ButtonCTA() {
  const {
    state: { ctaLink, ctaText, customCtaText },
  } = useAdStory();

  const selectedOption = CTA_OPTIONS.find((option) => option.value === ctaText);
  const buttonText = selectedOption?.label;
  const ctaButtonText = 'CUSTOM_TEXT' === ctaText ? customCtaText : buttonText;

  if (!isURL(ctaLink) || !ctaButtonText) {
    return null;
  }

  return (
    <Link target="_blank" href={ctaLink} rel="noreferrer">
      {ctaButtonText}
    </Link>
  );
}

export default ButtonCTA;
