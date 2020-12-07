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
import { isEmpty } from 'lodash';
/**
 * Internal dependencies
 */
/**
 * WordPress dependencies
 */
import {
  Modal,
  RangeControl,
  SelectControl,
  Button,
} from '@wordpress/components';
import { dispatch, select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import name from '../store/name';
import { isCircleView, updateViewSettings } from '../utils';
import TinyMCEToggle from './controls/Toggle';

const WebStoriesModal = (props) => {
  const { modalOpen, settings, prepareShortCode } = props;
  const { author, date, title, number, columns, order, view } = settings;

  return (
    <>
      {modalOpen && (
        <Modal
          onRequestClose={() => {
            dispatch(name).toggleModal(false);
          }}
          closeButtonLabel={__('Close', 'web-stories')}
          title={__('Web Stories', 'web-stories')}
          className={'component_web_stories_mce_model'}
        >
          {!isEmpty(view) && (
            <SelectControl
              label={__('Select View Type', 'web-stories')}
              value={view}
              options={window.webStoriesMCEData.views}
              onChange={(view) => dispatch(name).setCurrentView(view)}
            />
          )}

          <TinyMCEToggle field={'title'} fieldObj={title} />

          <TinyMCEToggle field={'author'} fieldObj={author} />

          <TinyMCEToggle field={'date'} fieldObj={date} />

          <RangeControl
            label={__('Number of Stories', 'web-stories')}
            value={number}
            min={1}
            max={20}
            onChange={(items) => {
              updateViewSettings({ fieldObj: items, field: 'number' });
            }}
          />

          {!isCircleView() && (
            <RangeControl
              label={__('Number of Columns', 'web-stories')}
              value={columns}
              min={1}
              max={4}
              onChange={(cols) =>
                updateViewSettings({
                  fieldObj: parseInt(cols, 10),
                  field: 'columns',
                })
              }
            />
          )}

          {!isEmpty(order) && (
            <SelectControl
              label={__('Select Order', 'web-stories')}
              value={order}
              options={window.webStoriesMCEData.orderlist}
              onChange={(order) => {
                updateViewSettings({ fieldObj: order, field: 'order' });
              }}
            />
          )}

          <div style={{ padding: '20px 0' }} className={'alignright'}>
            <Button
              isPrimary
              onClick={() => {
                const editorInstance = select(name).getEditor();

                if (editorInstance) {
                  const shortcode = prepareShortCode();
                  editorInstance.insertContent(shortcode);
                }

                dispatch(name).toggleModal(false);
              }}
            >
              {__('Okay', 'web-stories')}
            </Button>
            <Button onClick={() => dispatch(name).toggleModal(false)}>
              {__('Cancel', 'web-stories')}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default WebStoriesModal;
