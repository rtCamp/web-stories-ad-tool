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
import Inspector from '../inspector';
import Canvas from '../canvas';
import RichTextProvider from '../richText/provider';
import ErrorBoundary from '../errorBoundary';
import Modal from '../modal';
import useAdStory from '../../app/storyAd/useAdStory';
import localStore from '../../utils/localStore';
import { CanvasArea, InspectorArea } from './layout';

const ModalContent = styled.div`
  color: #fff;
  margin: auto;
`;

function Workspace() {
  const {
    state: { showDownloadModal },
    actions: { updateShowDownloadModal },
  } = useAdStory();

  return (
    <RichTextProvider>
      <CanvasArea>
        <ErrorBoundary>
          <Canvas />
          <Modal
            open={showDownloadModal}
            onClose={() => {
              updateShowDownloadModal(false);
            }}
            overlayStyles={{
              left: '50%',
              top: '50%',
              height: '85%',
              transform: 'translate(-50%, -50%)',
              padding: '20px',
            }}
          >
            <ModalContent>
              <button
                onClick={() => {
                  updateShowDownloadModal(false);
                }}
              >
                {'Close Details'}
              </button>
              <h1> {'INSTRUCTIONS'} </h1>
              <pre>{localStore.getItemByKey('readme')}</pre>

              <h1> {'MARKUP'} </h1>
              <p>{`${localStore
                .getItemByKey('markup')
                ?.substring(0, 130)}...`}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    localStore.getItemByKey('markup')
                  );
                }}
              >
                {'Copy Markup to clipboard'}
              </button>

              <h1> {'ASSETS'} </h1>
              {0 < localStore.getItemByKey('assets')?.assets.length
                ? localStore.getItemByKey('assets')?.assets.map((image) => (
                    <button key={image.src}>
                      <a
                        href={image.src}
                        download={image.name}
                      >{`Download ${image.name}`}</a>
                    </button>
                  ))
                : 'No Assets to download'}
            </ModalContent>
          </Modal>
        </ErrorBoundary>
      </CanvasArea>
      <InspectorArea>
        <ErrorBoundary>
          <Inspector />
        </ErrorBoundary>
      </InspectorArea>
    </RichTextProvider>
  );
}

export default Workspace;
