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
import { dateI18n, format, __experimentalGetSettings } from '@wordpress/date';

function StoryPlayer({
  url,
  title,
  poster,
  author,
  date,
  isShowingStoryPoster,
  isShowingAuthor,
  isShowingDate,
  isShowingTitle,
  listViewImageAlignment,
}) {
  const singleStoryClasses = classNames('latest-stories__story-wrapper', {
    'has-poster': isShowingStoryPoster,
  });
  const imageAlignmentClass = classNames({
    [`image-align-${listViewImageAlignment}`]: listViewImageAlignment,
  });
  const hasContentOverlay = isShowingTitle || isShowingAuthor || isShowingDate;
  const dateFormat = __experimentalGetSettings().formats.date;
  const ref = useRef(null);

  useEffect(() => {
    if (isShowingStoryPoster) {
      return;
    }

    if (ref.current && global.AmpStoryPlayer) {
      const player = new global.AmpStoryPlayer(global, ref.current);
      player.load();
    }
  }, [isShowingStoryPoster]);

  return (
    <div className={singleStoryClasses}>
      <div className="latest-stories__story-overlay" />
      <div className={imageAlignmentClass}>
        {isShowingStoryPoster ? (
          <div
            className="latest-stories__story-placeholder"
            style={{ backgroundImage: `url(${poster}` }}
          />
        ) : (
          <amp-story-player height="430px" width="285px" ref={ref}>
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
          <div className="story-content-overlay latest-stories__story-content-overlay">
            {isShowingTitle && (
              <div className="story-content-overlay__title">
                {title ? <RawHTML>{title}</RawHTML> : ''}
              </div>
            )}
            <div className="story-content-overlay__author-date">
              {isShowingAuthor && (
                <div className="story-content-overlay__author">{`By ${author}`}</div>
              )}
              {isShowingDate && (
                <time
                  dateTime={format('c', date)}
                  className="story-content-overlay__date"
                >
                  {`On ${dateI18n(dateFormat, date)}`}
                </time>
              )}
            </div>
          </div>
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
  isShowingStoryPoster: PropTypes.bool,
  isShowingAuthor: PropTypes.bool,
  isShowingDate: PropTypes.bool,
  isShowingTitle: PropTypes.bool,
  listViewImageAlignment: PropTypes.string,
};

export default StoryPlayer;
