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
import { default as ReactModal } from 'react-modal';
import PropTypes from 'prop-types';
import { createGlobalStyle } from 'styled-components';

/**
 * Internal dependencies
 */
import theme from '../../theme';

export const GlobalStyle = createGlobalStyle`
  body.edit-story .WebStories_ReactModal__Overlay {
    opacity: 0;
    transition: opacity 0.1s ease-out;
  }

  body.edit-story.folded .WebStories_ReactModal__Overlay {
    left: 0;
  }

  body.edit-story .WebStories_ReactModal__Overlay.ReactModal__Overlay--after-open {
    opacity: 1;
  }

  body.edit-story .WebStories_ReactModal__Overlay.ReactModal__Overlay--before-close {
    opacity: 0;
  }
`;

function Modal({
  children,
  open,
  onClose,
  style,
  contentStyles,
  overlayStyles,
  ...props
}) {
  return (
    <ReactModal
      {...props}
      style={{
        maxHeight: '100vh',
        ...style,
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          background: theme.colors.bg.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style?.overlay,
          ...overlayStyles,
        },
        content: {
          overflow: 'auto',
          outline: 'none',
          display: 'flex',
          maxHeight: '100%',
          justifyContent: 'center',
          ...style?.content,
          ...contentStyles,
        },
      }}
      isOpen={open}
      onRequestClose={onClose}
      className="WebStories_ReactModal__Content"
      overlayClassName="WebStories_ReactModal__Overlay"
      closeTimeoutMS={100}
    >
      {children}
    </ReactModal>
  );
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  style: PropTypes.object,
  overlayStyles: PropTypes.object,
  contentStyles: PropTypes.object,
  children: PropTypes.node,
};

export default Modal;
