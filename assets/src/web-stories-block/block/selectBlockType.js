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
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Card, CardBody, CardMedia, Placeholder } from '@wordpress/components';
import { BlockIcon } from '@wordpress/block-editor';
import { Icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { light } from '../../design-system/theme/colors';
import { BLOCK_TYPES } from './constants';

const TypeGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  grid-auto-rows: minmax(100px, auto);

  & * {
    cursor: pointer;
  }
`;

const TypeMedia = styled(CardMedia)`
  background-color: ${light.blue[50]};
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TypeCardBody = styled(CardBody)`
  text-align: center;
  font-weight: 600;
`;

function SelectBlockType({ icon, setAttributes }) {
  const label = __('Web Stories', 'web-stories');
  const instruction = __('Select Block Type', 'web-stories');

  return (
    <Placeholder
      icon={<BlockIcon icon={icon} showColors />}
      label={label}
      instructions={instruction}
    >
      <TypeGrid>
        {BLOCK_TYPES.map((blockType) => (
          <Card
            key={blockType.id}
            isBorderless={false}
            isElevated={false}
            size="extraSmall"
            onClick={() => {
              setAttributes({ blockType: blockType.id });
            }}
          >
            <TypeMedia>
              <Icon
                icon={blockType.icon}
                fill={light.blue[5]}
                width="50"
                height="50"
              />
            </TypeMedia>
            <TypeCardBody>{blockType.label}</TypeCardBody>
          </Card>
        ))}
      </TypeGrid>
    </Placeholder>
  );
}

SelectBlockType.propTypes = {
  icon: PropTypes.func,
  setAttributes: PropTypes.func.isRequired,
};

export default SelectBlockType;
