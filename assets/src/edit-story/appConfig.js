/*
 * Copyright 2021 Google LLC
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
const url = window.webStoriesAdConfig.url;

// @todo Remove items not required for story ad.
export default {
  id: 'web-stories-editor',
  config: {
    autoSaveInterval: 60,
    isRTL: false,
    locale: {
      locale: 'en-US',
      dateFormat: 'F j, Y',
      timeFormat: 'g:i a',
      gmtOffset: '0',
      timezone: '',
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      monthsShort: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      weekdays: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      weekdaysInitials: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      weekStartsOn: 1,
    },
    allowedFileTypes: ['jpe', 'jpeg', 'jpg', 'png'],
    allowedImageFileTypes: ['jpe', 'jpeg', 'jpg', 'png'],
    allowedImageMimeTypes: ['image/png', 'image/jpeg'],
    allowedMimeTypes: {
      image: ['image/png', 'image/jpeg', 'image/gif'],
      audio: [],
      video: ['video/mp4', 'video/webm'],
    },
    postType: 'web-story',
    storyId: 1,
    dashboardLink: '',
    assetsURL: `${url}assets/`,
    cdnURL: 'https://wp.stories.google/static/main/',
    maxUpload: 536870912,
    isDemo: false,
    capabilities: {
      hasPublishAction: true,
      hasAssignAuthorAction: true,
      hasUploadMediaAction: true,
    },
    api: {
      users: '/web-stories/v1/users/',
      currentUser: '/web-stories/v1/users/me/',
      stories: '/web-stories/v1/web-story/',
      media: '/web-stories/v1/media/',
      link: '/web-stories/v1/link/',
      statusCheck: '/web-stories/v1/status-check/',
      metaBoxes: '',
      storyLocking: '',
    },
    metadata: {
      publisher: {
        name: 'WordPress',
        logo: null,
      },
    },
    postLock: {
      interval: 150,
      showLockedDialog: true,
    },
    version: '1.7.0-alpha.0',
    nonce: '5cd6ce0dfe',
    encodeMarkup: true,
    metaBoxes: {
      normal: [],
      advanced: [],
      side: [],
    },
    ffmpegCoreUrl:
      'https://wp.stories.google/static/main/js/@ffmpeg/core@0.8.5/dist/ffmpeg-core.js',
  },
  flags: {
    enableSVG: false,
    videoOptimization: true,
    enablePostLocking: false,
    enableStickers: false,
    enableExperimentalAnimationEffects: false,
    enableQuickTips: true,
    showTextAndShapesSearchInput: false,
    showElementsTab: false,
    incrementalSearchDebounceMedia: false,
    customMetaBoxes: true,
    customPageTemplates: false,
  },
  publicPath: `${url}assets/js/`,
};
