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
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { useRef, useEffect, RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import StoryContentOverlay from './components/storyContentOverlay';

function StoryPlayer({
  url,
  title,
  poster,
  author,
  date,
  isShowingStoryPlayer,
  isShowingAuthor,
  isShowingDate,
  isShowingTitle,
  imageOnRight,
}) {
  const singleStoryClasses = classNames('web-stories-list__story-wrapper', {
    'has-poster': !isShowingStoryPlayer,
  });
  const imageAlignmentClass = classNames('web-stories-list__inner-wrapper', {
    [`image-align-right`]: imageOnRight,
    [`image-align-left`]: !imageOnRight,
  });
  const hasContentOverlay = isShowingTitle || isShowingAuthor || isShowingDate;
  const ref = useRef();

  useEffect(() => {
    if (!isShowingStoryPlayer) {
      return;
    }

    if (ref.current && global.AmpStoryPlayer) {
      const player = new global.AmpStoryPlayer(global, ref.current);
      player.load();
    }
  }, [isShowingStoryPlayer]);

  return (
    <div className={singleStoryClasses}>
      <div className={imageAlignmentClass}>
        {!isShowingStoryPlayer ? (
          <div
            className="web-stories-list__story-placeholder"
            style={{ backgroundImage: `url(${poster}` }}
          />
        ) : (
          <amp-story-player height="430" width="285" ref={ref}>
            <a
              href={url}
              style={{
                ['--story-player-poster']: poster
                  ? `url('${poster}')`
                  : undefined,
              }}
            >
              {title ? <RawHTML>{title}</RawHTML> : ''}
            </a>
          </amp-story-player>
        )}
        {hasContentOverlay && (
          <StoryContentOverlay
            isShowingTitle={isShowingTitle}
            title={title}
            isShowingAuthor={isShowingAuthor}
            author={author}
            isShowingDate={isShowingDate}
            date={date}
          />
        )}
      </div>
    </div>
  );
}

StoryPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string,
  poster: PropTypes.string,
  author: PropTypes.string,
  date: PropTypes.string,
  isShowingStoryPlayer: PropTypes.bool,
  isShowingAuthor: PropTypes.bool,
  isShowingDate: PropTypes.bool,
  isShowingTitle: PropTypes.bool,
  imageOnRight: PropTypes.bool,
};

export default StoryPlayer;
