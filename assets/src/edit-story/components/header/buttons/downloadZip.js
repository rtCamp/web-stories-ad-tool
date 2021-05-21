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
import ButtonWithChecklistWarning from './buttonWithChecklistWarning';

const COMMON_MIME_TYPE_MAPPING = {
  'image/gif': 'gif',
  'image/jpeg': 'jpeg',
  'image/png': 'jpeg',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
};

function DownloadZip() {
  const {
    internal: { reducerState },
  } = useStory();

  const { pages, current, selection, story } = reducerState;

  const {
    state: { ctaLink, ctaText, customCtaText, landingPageType, isDownloading },
    actions: { updateIsDownloadingStatus },
  } = useAdStory();

  // Deep clone page object.
  const currentPage = pages[0] ? JSON.parse(JSON.stringify(pages[0])) : {};

  const zipStoryAd = async (storyContent) => {
    let markup = `<!doctype html>${storyContent}`;

    const elements = {
      image: [],
    };

    currentPage.elements.forEach((element) => {
      if (element?.type in elements) {
        elements[element.type].push(element);
      }
    });

    const zip = new JSZip();

    await Promise.all(
      Object.keys(elements).map(async (mediaType) => {
        const mediaElements = elements[mediaType];

        if (mediaElements.length) {
          await Promise.all(
            mediaElements.map(async (mediaElement, index) => {
              const { src, mimeType, id } = mediaElement.resource;
              const extension = COMMON_MIME_TYPE_MAPPING[mimeType];

              if (!extension) {
                return;
              }

              let imageSrc = src;

              /**
               * Download double size image of the page ratio as unsplash image size can be very
               * large and we aren't using srcset to keep things simple for the user.
               */
              if (src.startsWith('https://images.unsplash.com')) {
                imageSrc = addQueryArgs(src, {
                  w: PAGE_WIDTH * 2,
                  h: (PAGE_WIDTH * 2) / PAGE_RATIO,
                });
              }

              const resp = await fetch(imageSrc);
              const respBlob = await resp.blob();
              const fileName = `${mediaType}-${index + 1}.${extension}`;
              const file = new File([respBlob], fileName);

              const elementIndex = currentPage.elements.findIndex(
                (element) => element?.resource?.id === id
              );

              if (elementIndex) {
                currentPage.elements[elementIndex].resource.src = fileName;
              }

              const encodedUrl = src.replaceAll('&', '&amp;'); // To match url in the rendered markup.
              markup = markup.replace(encodedUrl, fileName);

              zip.file(fileName, file);
            })
          );
        }
      })
    );

    const storyData = {
      current,
      selection,
      story: { globalStoryStyles: story?.globalStoryStyles },
      version: DATA_VERSION,
      pages: [currentPage],
      storyAd: { ctaLink, ctaText, customCtaText, landingPageType },
    };

    zip.file('config.json', JSON.stringify(storyData));

    const readMeText = `
    In order to view or test this ad as a standalone AMP page locally before uploading it to your platform, it needs to be run on any https-enabled server. For example, you may use the "Web Server for Chrome" chrome extension and view the ad by enabling its HTTPS option.

    Uploading the ad to google ad manager:
    1. Choose "Code Type" as "AMP", copy the entire content of index.html without formatting and paste it inside the "AMP HTML" textbox.
    2. All assets of the story ad have been downloaded as part of the zip and have a relative path in index.html, upload those assets and change its file path by inserting macros.
    `;

    zip.file('index.html', markup);
    zip.file('README.txt', readMeText);

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'story-ad.zip');
    });
  };

  const download = async () => {
    const storyAd = { ctaLink, ctaText, customCtaText, landingPageType };

    updateIsDownloadingStatus(true);

    const storyProps = getStoryPropsToSave({
      story,
      pages,
      metadata: {},
      flags: {},
      storyAd,
    });
    await zipStoryAd(storyProps.content);

    updateIsDownloadingStatus(false);
  };

  return (
    <ButtonWithChecklistWarning
      variant={BUTTON_VARIANTS.RECTANGLE}
      type={BUTTON_TYPES.PRIMARY}
      size={BUTTON_SIZES.SMALL}
      onClick={download}
      disabled={isDownloading}
      text={__('Download Zip', 'web-stories')}
      hasErrors={!isURL(ctaLink)}
    />
  );
}

export default DownloadZip;
