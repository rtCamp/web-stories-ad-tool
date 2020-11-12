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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import ApiProvider from '../../dashboard/app/api/apiProvider';
import { ConfigProvider } from '../../dashboard/app/config';
import theme from '../../dashboard/theme';
import {
  theme as externalDesignSystemTheme,
  lightMode,
} from '../../design-system';
import EmbedPlaceholder from './embedPlaceholder';
import { icon } from './';

const LatestStoriesEdit = () => {
  const [selectedStories, setSelectedStories] = useState([]);
  const [selectedStoriesObject, setSelectedStoriesObject] = useState([]);
  const [showPlaceholder] = useState(true);
  const label = __('Selected Web Stories', 'web-stories');
  const { config } = global.webStoriesSelectedBlockSettings;

  const activeTheme = {
    DEPRECATED_THEME: theme,
    ...externalDesignSystemTheme,
    colors: lightMode,
  };

  if (showPlaceholder) {
    return (
      <ThemeProvider theme={activeTheme}>
        <ConfigProvider config={config}>
          <ApiProvider>
            <EmbedPlaceholder
              icon={icon}
              label={label}
              selectedStories={selectedStories}
              setSelectedStories={setSelectedStories}
              selectedStoriesObject={selectedStoriesObject}
              setSelectedStoriesObject={setSelectedStoriesObject}
            />
          </ApiProvider>
        </ConfigProvider>
      </ThemeProvider>
    );
  }

  return <div>{__('Selected Stories', 'web-stories')}</div>;
};

export default LatestStoriesEdit;
