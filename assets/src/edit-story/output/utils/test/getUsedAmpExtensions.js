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
import getUsedAmpExtensions from '../getUsedAmpExtensions';

describe('getUsedAmpExtensions', () => {
  it('should always include the AMP4Ads runtime script', () => {
    const actual = getUsedAmpExtensions([]);

    expect(actual).toHaveLength(1);
    expect(actual).toStrictEqual(
      expect.arrayContaining([
        { src: 'https://cdn.ampproject.org/amp4ads-v0.js' },
      ])
    );
  });

  it('should include the amp-animation script if there is an animation', () => {
    const pages = [
      {
        elements: [{ type: 'animations' }],
      },
    ];

    const actual = getUsedAmpExtensions(pages);

    expect(actual).toHaveLength(2);
    expect(actual).toStrictEqual(
      expect.arrayContaining([
        {
          name: 'amp-animation',
          src: 'https://cdn.ampproject.org/v0/amp-animation-0.1.js',
        },
      ])
    );
  });

  it('should include the amp-video script only once if there are multiple videos', () => {
    const pages = [
      {
        elements: [{ type: 'animations' }],
      },
      {
        elements: [{ type: 'text' }],
      },
      {
        elements: [{ type: 'animations' }],
      },
      {
        elements: [{ type: 'animations' }],
      },
    ];

    const actual = getUsedAmpExtensions(pages);

    expect(actual).toHaveLength(2);
    expect(actual).toStrictEqual(
      expect.arrayContaining([
        {
          name: 'amp-animation',
          src: 'https://cdn.ampproject.org/v0/amp-animation-0.1.js',
        },
      ])
    );
  });
});
