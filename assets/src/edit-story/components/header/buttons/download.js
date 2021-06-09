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
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { __ } from '@web-stories-wp/i18n';
import { DATA_VERSION } from '@web-stories-wp/migration';

/**
 * WordPress dependencies
 */
import { addQueryArgs, isURL } from '@wordpress/url';

/**
 * Internal dependencies
 */
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '../../../../design-system';
import { useStory } from '../../../app';
import useAdStory from '../../../app/storyAd/useAdStory';
import getStoryPropsToSave from '../../../app/story/utils/getStoryPropsToSave';
import { PAGE_RATIO, PAGE_WIDTH } from '../../../constants';
import isBlobURL from '../../../utils/isBlobURL';
import { DEFAULT_CTA_LINK } from '../../../constants/adOptions';
import ButtonWithChecklistWarning from './buttonWithChecklistWarning';

const COMMON_MIME_TYPE_MAPPING = {
  'image/gif': 'gif',
  'image/jpeg': 'jpeg',
  'image/png': 'jpeg',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
};

function Download() {
  const {
    adOptions,
    reducerState,
    currentPage: page,
  } = useStory(
    ({
      state: {
        story: { adOptions },
        currentPage,
      },
      internal: { reducerState },
    }) => ({ adOptions, reducerState, currentPage })
  );

  const { pages, current, selection, story } = reducerState;

  const {
    state: { isDownloading },
    actions: { updateIsDownloadingStatus },
  } = useAdStory();

  // Deep clone page object.
  const currentPage = page ? JSON.parse(JSON.stringify(page)) : {};

  const zipStoryAd = async (storyContent) => {
    let markup = `<!doctype html>${storyContent}`;

    const zip = new JSZip();

    const mediaTypes = ['image', 'video'];
    let mediaIndex = 1;

    await Promise.all(
      currentPage.elements.map(async (element) => {
        const mediaType = element.type;

        if (!mediaTypes.includes(mediaType)) {
          return;
        }

        const { src, mimeType, poster } = element.resource;
        const extension = COMMON_MIME_TYPE_MAPPING[mimeType];

        if (!extension) {
          return;
        }

        /**
         * Use double size image of the page ratio as unsplash image size can be very
         * large and we aren't using srcset to keep things simple for the user.
         */
        if (src.startsWith('https://images.unsplash.com')) {
          const resizedSrc = addQueryArgs(src, {
            w: PAGE_WIDTH * 2,
            h: (PAGE_WIDTH * 2) / PAGE_RATIO,
          });

          const markupSrc = src.replaceAll('&', '&amp;');
          markup = markup.replace(markupSrc, resizedSrc);
          return;
        }

        if (!isBlobURL(src)) {
          return;
        }

        const index = mediaIndex;
        mediaIndex++;

        const resp = await fetch(src);
        const respBlob = await resp.blob();
        const fileName = `${mediaType}-${index}.${extension}`;
        const file = new File([respBlob], fileName);

        let posterFileName;
        let posterFile;
        if (poster) {
          const posterResp = await fetch(poster);
          const posterRespBlob = await posterResp.blob();
          posterFileName = `${mediaType}-${index}-poster.jpeg`;
          posterFile = new File([posterRespBlob], posterFileName);
        }

        element.resource.src = fileName;

        if (posterFileName) {
          element.resource.poster = posterFileName;
        }

        const encodedUrl = src.replaceAll('&', '&amp;'); // To match url in the rendered markup.
        markup = markup.replace(encodedUrl, fileName);

        zip.file(fileName, file);

        if (posterFileName && posterFile) {
          const encodedPosterUrl = poster.replaceAll('&', '&amp;'); // To match url in the rendered markup.
          markup = markup.replaceAll(encodedPosterUrl, posterFileName);

          zip.file(posterFileName, posterFile);
        }
      })
    );

    const storyData = {
      current,
      selection,
      story: {
        globalStoryStyles: story?.globalStoryStyles,
        adOptions: story?.adOptions,
      },
      version: DATA_VERSION,
      pages: [currentPage],
    };

    zip.file('config.json', JSON.stringify(storyData));

    const readMeText = `
Uploading ad to google ad manager:
1. Choose "Code Type" as "AMP", copy the entire content of index.html without formatting and paste it inside the "AMP HTML" textbox.
2. Your local uploaded assets of the story ad have been downloaded as part of the zip and have a relative path in index.html, please upload those assets and change its file path by inserting macros. If you have used external assets, they would have direct external links in html. 
    `;

    zip.file('index.html', markup);
    zip.file('README.txt', readMeText);

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'story-ad.zip');
    });
  };

  const download = async () => {
    updateIsDownloadingStatus(true);

    const storyProps = getStoryPropsToSave({
      story,
      pages,
      metadata: {},
      flags: {},
    });

    await zipStoryAd(storyProps.content);

    updateIsDownloadingStatus(false);
  };

  const hasErrors =
    !isURL(adOptions?.ctaLink) || DEFAULT_CTA_LINK === adOptions?.ctaLink;

  return (
    <ButtonWithChecklistWarning
      variant={BUTTON_VARIANTS.RECTANGLE}
      type={BUTTON_TYPES.PRIMARY}
      size={BUTTON_SIZES.SMALL}
      onClick={download}
      disabled={isDownloading}
      text={__('Download Zip', 'web-stories')}
      hasErrors={hasErrors}
    />
  );
}

export default Download;
