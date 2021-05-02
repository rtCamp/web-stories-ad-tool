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
import useAdStory from '../../app/storyAd/useAdStory';
import CircularProgress from '../circularProgress';
import Buttons from './buttons';
import HeaderProvider from './provider';
import ImportButton from './buttons/importButton';

const Background = styled.header.attrs({
  role: 'group',
  'aria-label': __('Story canvas header', 'web-stories'),
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.bg.primary};
`;

const LeftButtonCell = styled.div`
  display: flex;
  padding: 1em;
`;

const ButtonCell = styled.div`
  grid-area: buttons;
`;

const LOADER_SIZE = 24;

const Spinner = styled.div`
  position: absolute;
  top: 0;
  left: 10px;
`;

const IconWithSpinner = styled.div`
  position: relative;
  width: ${LOADER_SIZE}px;
  height: ${LOADER_SIZE}px;
`;

function Loading() {
  const {
    state: { isImporting },
  } = useAdStory();

  return (
    isImporting && (
      <Spinner>
        <CircularProgress size={LOADER_SIZE} />
      </Spinner>
    )
  );
}

function HeaderLayout() {
  return (
    <HeaderProvider>
      <Background>
        <LeftButtonCell>
          <ImportButton />
          <IconWithSpinner>
            <Loading />
          </IconWithSpinner>
        </LeftButtonCell>
        <ButtonCell>
          <Buttons />
        </ButtonCell>
      </Background>
    </HeaderProvider>
  );
}

export default HeaderLayout;
