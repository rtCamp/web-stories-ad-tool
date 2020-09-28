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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import useFocusOut from '../../utils/useFocusOut';

const PopoverContainer = styled.div`
  width: 276px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.bg.v17};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const baseEffectButtonStyles = css`
  border: none;
  padding: 8px;
  border-radius: 4px;
  font-family: Google Sans;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const EffectButton = styled.button`
  flex: 1;
  background: ${({ theme }) => theme.colors.bg.v18};
  color: ${rgba(255, 255, 255, 0.6)};
  ${baseEffectButtonStyles}
`;

const NoEffectButton = styled.button`
  flex: 1;
  background: ${rgba(255, 255, 255, 0.1)};
  color: ${rgba(255, 255, 255, 0.6)};
  ${baseEffectButtonStyles};
`;

export function AnimationPopover({ togglePopover }) {
  const ref = useRef();

  useFocusOut(ref, togglePopover);

  return (
    <PopoverContainer ref={ref}>
      <NoEffectButton>{__('No Effect', 'web-stories')}</NoEffectButton>
      <EffectButton>{__('Drop', 'web-stories')}</EffectButton>
      <EffectButton>{__('Fall', 'web-stories')}</EffectButton>
    </PopoverContainer>
  );
}

AnimationPopover.propTypes = {
  togglePopover: PropTypes.func.isRequired,
};
