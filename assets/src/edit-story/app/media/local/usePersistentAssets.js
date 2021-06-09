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
/**
 * External dependencies
 */
import { useCallback, useEffect, useRef } from 'react';

/**
 * Internal dependencies
 */
import { getDataFromSessionStorage } from '../../story/utils/sessionStore';
import getResourceFromLocalFile from '../utils/getResourceFromLocalFile';
import { useStory } from '../../story';
import { initIndexDb } from './initIndexDb';

function usePersistentAssets({ addLocalFiles, media }) {
  const isInitialMount = useRef(true);

  const { updateElementsByResourceId } = useStory((state) => ({
    updateElementsByResourceId: state.actions.updateElementsByResourceId,
  }));

  const updateResourcesFromStoredFiles = useCallback(
    (files) => {
      const sessionData = getDataFromSessionStorage();

      const { elements } = sessionData?.pages?.[0] ?? [];

      files.forEach((fileItem) => {
        elements.forEach(async (element) => {
          if (
            ['image', 'video'].includes(element?.type) &&
            element.resource.title === fileItem.title
          ) {
            const { resource: mediaData } = await getResourceFromLocalFile(
              fileItem.file
            );
            const resourceId = element.resource.id;
            const mediaResource = {
              id: resourceId,
              properties: ({ resource, ...rest }) => ({
                ...rest,
                resource: { ...mediaData, id: resourceId },
              }),
            };
            updateElementsByResourceId(mediaResource);
          }
        });
      });
    },
    [updateElementsByResourceId]
  );

  /**
   * Watch media state and store media files to index db.
   */
  useEffect(() => {
    if (isInitialMount.current) {
      return;
    }

    // This is to avoid storing it twice during import.
    const shouldSaveToIndexDb = media.every(({ file }) => Boolean(file));
    const mediaItemsToSave = media.map(({ file, title }) => ({
      file,
      title,
    }));

    if (shouldSaveToIndexDb) {
      initIndexDb(mediaItemsToSave, 'save');
    }

    isInitialMount.current = false;
  }, [media]);

  /**
   * Restore media and component mount.
   */
  useEffect(() => {
    if (isInitialMount.current) {
      initIndexDb(null, 'get', async (files) => {
        const fileItems = files.map((item) => item.file);
        await addLocalFiles(fileItems);

        updateResourcesFromStoredFiles(files);
      });

      isInitialMount.current = false;
    }
  }, [addLocalFiles, updateResourcesFromStoredFiles]);
}

export default usePersistentAssets;
