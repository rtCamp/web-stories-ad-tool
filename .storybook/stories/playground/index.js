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

export default {
  title: 'Playground|Stories Editor',
};

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
    stories: (storyId) => window.getStoryById(storyId),
    media: '',
    fonts: '',
    link: '',
    users: () => window.loadUsers(),
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

export const _default = () => {
  return <App config={config} />;
};




// This obviously doesn't belong in this file, and would require its own
// webpack to inject a custom 'config' that includes the window functions
// (as per above).
describe('Puppeteer test', () => {
  let getStoryById;
  let loadUsers;

  beforeEach(() => {
    getStoryById = jest.fn();
    loadUsers = jest.fn();
    getStoryById.mockImplementation((id) => createStory({ id }));
  });

  const stubAPIMocks = async (page) => {
    await page.exposeFunction('getStoryById', getStoryById);
    await page.exposeFunction('loadUsers', loadUsers);
    // ...
  };

  it('demo', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await stubAPIMocks(page);
    // ...
  })
});
