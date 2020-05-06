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
 * Internal dependencies
 */
import App from '../../../assets/src/edit-story/app';
import { createStory } from './_utils';

// @todo: Find better way to mock these.
const config = {
  allowedMimeTypes: {
    image: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
    audio: [],
    video: ['video/mp4'],
  },
  allowedFileTypes: ['png', 'jpeg', 'jpg', 'gif', 'mp4'],
  storyId: 1234,
  api: {
    stories: (storyId) => Promise.resolve(createStory({ id: storyId })),
    media: '',
    fonts: '',
    link: '',
    users: '',
    statuses: '',
  },
  metadata: {
    publisher: {
      name: '',
      logo: '',
    },
    poster: '',
  },
};

const whyDidYouRender = require('@welldone-software/why-did-you-render');
whyDidYouRender(React, {
  trackAllPureComponents: true,
  notifier: (payload) => window._addWhyDidYouRenderPayload(payload),
});

const wrapper = document.getElementById('container');
wrapper ? ReactDOM.render(<App config={config} />, wrapper) : false;
