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
const HtmlWebPackPlugin = require('html-webpack-plugin');

/**
 * Internal dependencies
 */
const { storiesEditor } = require('../../../webpack.config.js');

const storiesEditorE2E = {
  ...storiesEditor,
  entry: {
    'edit-story-e2e': './tests/e2e/app/index.js',
  },
  plugins: [
    ...storiesEditor.plugins,
    new HtmlWebPackPlugin({
      template: './tests/e2e/app/index.html',
      filename: './index.html',
    }),
  ],
  module: {
    rules: [
      ...storiesEditor.module.rules,
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
    ],
  },
  optimization: {
    ...storiesEditor.optimization,
    splitChunks: {
      cacheGroups: {
        stories: {
          name: 'edit-story-e2e',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
};

module.exports = [storiesEditorE2E];
