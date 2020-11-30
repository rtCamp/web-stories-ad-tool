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
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import StoryPlayer from '../storyPlayer';

const url =
  'https://preview.amp.dev/documentation/examples/introduction/stories_in_amp';
const title = 'Stories in AMP';
const poster = 'https://amp.dev/static/samples/img/story_dog2_portrait.jpg';
const date = '2020-01-01T00:00:00';
const author = 'Admin';

describe('StoryPlayer', () => {
  it('should render only empty div elements when nothing is provided', () => {
    const { container } = render(<StoryPlayer url={url} />);

    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        class="web-stories__controller"
      >
        <div
          class="web-stories__story-wrapper has-poster"
        >
          <div
            class="web-stories__inner-wrapper image-align-left"
          >
            <div
              class="web-stories__story-placeholder"
            />
          </div>
        </div>
      </div>
    `);
  });

  it('should set poster if only url and poster are provided', () => {
    const { container } = render(<StoryPlayer url={url} poster={poster} />);

    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        class="web-stories__controller"
      >
        <div
          class="web-stories__story-wrapper has-poster"
        >
          <div
            class="web-stories__inner-wrapper image-align-left"
          >
            <div
              class="web-stories__story-placeholder"
              style="background-image: url(https://amp.dev/static/samples/img/story_dog2_portrait.jpg);"
            />
          </div>
        </div>
      </div>
    `);
  });

  it('should show title, date and author if they are provided and enabled', () => {
    const { container } = render(
      <StoryPlayer
        url={url}
        title={title}
        isShowingTitle={true}
        date={date}
        isShowingDate={true}
        author={author}
        isShowingAuthor={true}
        poster={poster}
      />
    );

    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        class="web-stories__controller"
      >
        <div
          class="web-stories__story-wrapper has-poster"
        >
          <div
            class="web-stories__inner-wrapper image-align-left"
          >
            <div
              class="web-stories__story-placeholder"
              style="background-image: url(https://amp.dev/static/samples/img/story_dog2_portrait.jpg);"
            />
            <div
              class="story-content-overlay web-stories__story-content-overlay"
            >
              <div
                class="story-content-overlay__title"
              >
                <div>
                  Stories in AMP
                </div>
              </div>
              <div
                class="story-content-overlay__author-date"
              >
                <div
                  class="story-content-overlay__author"
                >
                  By Admin
                </div>
                <time
                  class="story-content-overlay__date"
                  datetime="2020-01-01T00:00:00+06:00"
                >
                  On January 1, 2020
                </time>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
  });

  it('should not show title, date and author if they are provided but disabled', () => {
    const { container } = render(
      <StoryPlayer
        url={url}
        title={title}
        isShowingTitle={false}
        date={date}
        isShowingDate={false}
        author={author}
        isShowingAuthor={false}
        poster={poster}
      />
    );

    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        class="web-stories__controller"
      >
        <div
          class="web-stories__story-wrapper has-poster"
        >
          <div
            class="web-stories__inner-wrapper image-align-left"
          >
            <div
              class="web-stories__story-placeholder"
              style="background-image: url(https://amp.dev/static/samples/img/story_dog2_portrait.jpg);"
            />
          </div>
        </div>
      </div>
    `);
  });

  it('should render an <amp-story-player> element if story player is enabled', () => {
    const { container } = render(
      <StoryPlayer url={url} isShowingStoryPlayer={true} />
    );

    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        class="web-stories__controller"
      >
        <div
          class="web-stories__story-wrapper"
        >
          <div
            class="web-stories__inner-wrapper image-align-left"
          >
            <amp-story-player
              height="430"
              width="285"
            >
              <a
                href="https://preview.amp.dev/documentation/examples/introduction/stories_in_amp"
              />
            </amp-story-player>
          </div>
        </div>
      </div>
    `);
  });
});
