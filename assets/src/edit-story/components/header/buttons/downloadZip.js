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
import { isURL } from '@wordpress/url';

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
    state: { ctaLink, ctaText, landingPageType, isDownloading },
    actions: { updateIsDownloadingStatus },
  } = useAdStory();

  const currentPage = pages[0];

  const storyData = {
    current,
    selection,
    story: { globalStoryStyles: story?.globalStoryStyles },
    version: DATA_VERSION,
    pages,
    storyAd: { ctaLink, ctaText, landingPageType },
  };

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

    zip.file('config.json', JSON.stringify(storyData));

    await Promise.all(
      Object.keys(elements).map(async (mediaType) => {
        const mediaElements = elements[mediaType];

        if (mediaElements.length) {
          await Promise.all(
            mediaElements.map(async (mediaElement, index) => {
              const { src, mimeType } = mediaElement.resource;
              const extension = COMMON_MIME_TYPE_MAPPING[mimeType];

              if (!extension) {
                return;
              }

              const resp = await fetch(src);
              const respBlob = await resp.blob();
              const fileName = `${mediaType}-${index + 1}.${extension}`;
              const file = new File([respBlob], fileName);

              const encodedUrl = src.replaceAll('&', '&amp;'); // To match url in the rendered markup.
              markup = markup.replace(encodedUrl, fileName);

              zip.file(fileName, file);
            })
          );
        }
      })
    );

    zip.file('index.html', markup);
    zip.file('README.txt', 'TBD');

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'story-ad.zip');
    });
  };

  const download = async () => {
    const storyAd = { ctaLink, ctaText, landingPageType };

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
