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
 * Internal dependencies
 */
import { AdBadge } from '../../../icons';

const AsideContainer = styled.aside`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 46px;
  z-index: 100001;
  user-select: none;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.2) 10%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0) 100%
  );
  color: white;
  display: flex;
  align-items: center;
  padding: 0 5px;
`;

function AdLabelOverlay() {
  return (
    <AsideContainer>
      <AdBadge width="38" height="38" />
    </AsideContainer>
  );
}

export default AdLabelOverlay;
