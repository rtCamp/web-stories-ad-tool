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
import { forwardRef } from '@wordpress/element';

function StoryPlayer(
  {
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
  },
  ref
) {
  const singleStoryClasses = classNames('latest-stories__story-wrapper', {
    'has-poster alignnone': isShowingStoryPoster,
  });
  const imageAlignmentClass = classNames({
    [`image-align-${listViewImageAlignment}`]: listViewImageAlignment,
  });
  const hasContentOverlay = isShowingTitle || isShowingAuthor || isShowingDate;

  if (isShowingStoryPoster) {
    return (
      <div className={singleStoryClasses}>
        <div className={imageAlignmentClass}>
          <div
            className="latest-stories__story-placeholder"
            style={{ backgroundImage: `url(${poster}` }}
          />
          {hasContentOverlay && (
            <div className="story-content-overlay latest-stories__story-content-overlay">
              {isShowingTitle && (
                <div className="story-content-overlay__title">{title}</div>
              )}
              <div className="story-content-overlay__author-date">
                {isShowingAuthor && <div>{`By ${author}`}</div>}
                {isShowingDate && (
                  <time className="story-content-overlay__date">
                    {`On ${date}`}
                  </time>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={singleStoryClasses}>
      <amp-story-player height="430px" ref={ref}>
        <a
          href={url}
          style={{
            ['--story-player-poster']: poster ? `url('${poster}')` : undefined,
          }}
        >
          {title ? title : ''}
        </a>
        {hasContentOverlay && (
          <div className="story-content-overlay latest-stories__story-content-overlay">
            {isShowingTitle && (
              <div className="story-content-overlay__title">{title}</div>
            )}
            <div className="story-content-overlay__author-date">
              {isShowingAuthor && <div>{`By ${author}`}</div>}
              {isShowingDate && (
                <time className="story-content-overlay__date">
                  {`On ${date}`}
                </time>
              )}
            </div>
          </div>
        )}
      </amp-story-player>
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

const StoryPlayerWithRef = forwardRef(StoryPlayer);

export default StoryPlayerWithRef;
