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
 * Internal dependencies
 */
import StoryPlayer from './storyPlayer';

function StoriesPreview(props) {
  const {
    attributes: {
      viewType,
      imageOnRight,
      isShowingTitle,
      isShowingExcerpt,
      sizeOfCircles,
      isShowingViewAll,
      isShowingAuthor,
      isShowingDate,
    },
    viewAllLabel,
    alignmentClass,
    blockClasses,
    storiesObject,
  } = props;

  return (
    <div className={alignmentClass}>
      <div className={blockClasses}>
        {storiesObject.map((story) => {
          let title = '';

          if (story.title.rendered) {
            title =
              'circles' === viewType && story.title.rendered.length > 45
                ? `${story.title.rendered.substring(0, 45)}...`
                : story.title.rendered;
          }

          return (
            <StoryPlayer
              key={story.id}
              url={story.link}
              title={title}
              excerpt={story.excerpt.rendered ? story.excerpt.rendered : ''}
              date={story.date_gmt}
              author={story._embedded.author[0].name}
              poster={story.featured_media_url}
              imageOnRight={imageOnRight}
              isShowingAuthor={isShowingAuthor}
              isShowingDate={isShowingDate}
              isShowingTitle={isShowingTitle}
              isShowingExcerpt={isShowingExcerpt}
              sizeOfCircles={sizeOfCircles}
            />
          );
        })}
      </div>
      {isShowingViewAll && (
        <div className="web-stories-list__archive-link">{viewAllLabel}</div>
      )}
    </div>
  );
}

StoriesPreview.propTypes = {
  attributes: PropTypes.shape({
    viewType: PropTypes.string,
    imageOnRight: PropTypes.bool,
    isShowingTitle: PropTypes.bool,
    isShowingExcerpt: PropTypes.bool,
    isShowingAuthor: PropTypes.bool,
    isShowingDate: PropTypes.bool,
    sizeOfCircles: PropTypes.number,
    isShowingViewAll: PropTypes.bool,
  }),
  alignmentClass: PropTypes.string,
  blockClasses: PropTypes.string,
  storiesObject: PropTypes.array,
  viewAllLabel: PropTypes.string,
};

export default StoriesPreview;
