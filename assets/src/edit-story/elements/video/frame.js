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
import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import MediaFrame from '../media/frame';
import { elementFillContent } from '../shared';
import useCanvas from '../../components/canvas/useCanvas';
import { useStory } from '../../app/story';

const Wrapper = styled.div`
  ${elementFillContent}
`;

function VideoFrame({ element }) {
  const { id } = element;
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const {
    state: { videosById },
  } = useCanvas();

  const videoElement = videosById[id];

  const {
    state: { selectedElementIds },
  } = useStory();

  const isElementSelected = selectedElementIds.includes(element.id);

  useEffect(() => {
    if (!isElementSelected && videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
      setPlaying(false);
    }
  }, [isElementSelected, videoElement]);

  const onVideoEnd = useCallback(() => {
    setPlaying(false);
    videoElement.currentTime = 0;
  }, [videoElement]);

  useEffect(() => {
    if (videoElement) {
      videoElement.addEventListener('ended', onVideoEnd);
    }
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('ended', onVideoEnd);
      }
    };
  }, [onVideoEnd, videoElement]);

  const handlePlay = () => {
    if (videoElement) {
      if (videoElement.paused) {
        const playPromise = videoElement.play();
        if (playPromise) {
          playPromise
            .then(() => {
              setPlaying(true);
            })
            .catch(() => {});
        }
      } else {
        videoElement.pause();
        setPlaying(false);
      }
    }
  };

  return (
    <Wrapper
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      hovered={hovered}
    >
      <MediaFrame element={element} />
      {hovered && (
        <button
          onClick={handlePlay}
          style={{
            position: 'absolute',
            background: '#fff',
            padding: '1px 6px',
            borderRadius: 3,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
          }}
        >
          {playing ? 'PAUSE' : 'PLAY'}
        </button>
      )}
    </Wrapper>
  );
}

VideoFrame.propTypes = {
  element: StoryPropTypes.elements.video.isRequired,
};

export default VideoFrame;
