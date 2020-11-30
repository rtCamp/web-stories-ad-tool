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

/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';
import { __experimentalGetSettings, dateI18n, format } from '@wordpress/date';

function StoryContentOverlay(props) {
  const dateFormat = __experimentalGetSettings().formats.date;

  return (
    <div className="story-content-overlay web-stories-list__story-content-overlay">
      {props.isShowingTitle && (
        <div className="story-content-overlay__title">
          {props.title ? <RawHTML>{props.title}</RawHTML> : ''}
        </div>
      )}
      <div className="story-content-overlay__author-date">
        {props.isShowingAuthor && (
          <div className="story-content-overlay__author">{`By ${props.author}`}</div>
        )}
        {props.isShowingDate && (
          <time
            dateTime={format('c', props.date)}
            className="story-content-overlay__date"
          >
            {`On ${dateI18n(dateFormat, props.date)}`}
          </time>
        )}
      </div>
    </div>
  );
}

StoryContentOverlay.propTypes = {
  isShowingTitle: PropTypes.bool,
  title: PropTypes.string,
  isShowingAuthor: PropTypes.bool,
  author: PropTypes.string,
  isShowingDate: PropTypes.bool,
  date: PropTypes.string,
};

export default StoryContentOverlay;
