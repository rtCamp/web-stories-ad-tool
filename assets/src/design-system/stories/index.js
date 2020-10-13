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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { dark, light } from '../theme/colors';
import { Headline, Text, THEME_CONSTANTS } from '../';

export default {
  title: 'DesignSystem/Colors',
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const Container = styled.div`
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ColorBlock = styled.span`
  width: 60%;
  height: 60%;
  border-radius: 50%;
  border: 1px solid gray;
  background-color: ${({ color }) => color};
`;

export const _default = () => {
  const { standard, accent, status } = dark;
  const { SMALL } = THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES;

  const StandardColors = Object.values(standard).map((color, idx) => (
    <Container key={idx}>
      <ColorBlock color={color} />
      <Text size={SMALL}>{color}</Text>
    </Container>
  ));

  const AccentColors = Object.values(accent).map((color, idx) => (
    <Container key={idx}>
      <ColorBlock color={color} />
      <Text size={SMALL}>{color}</Text>
    </Container>
  ));

  const StatusColors = Object.values(status).map((color, idx) => (
    <Container key={idx}>
      <ColorBlock color={color} />
      <Text size={SMALL}>{color}</Text>
    </Container>
  ));

  const fgLightColors = Object.values(light.fg).map((color, idx) => (
    <Container key={idx}>
      <ColorBlock color={color} />
      <Text size={SMALL}>{color}</Text>
    </Container>
  ));

  const bgLightColors = Object.values(light.bg).map((color, idx) => (
    <Container key={idx}>
      <ColorBlock color={color} />
      <Text size={SMALL}>{color}</Text>
    </Container>
  ));

  const fgDarkColors = Object.values(dark.fg).map((color, idx) => (
    <Container key={idx}>
      <ColorBlock color={color} />
      <Text size={SMALL}>{color}</Text>
    </Container>
  ));

  const bgDarkColors = Object.values(dark.bg).map((color, idx) => (
    <Container key={idx}>
      <ColorBlock color={color} />
      <Text size={SMALL}>{color}</Text>
    </Container>
  ));

  return (
    <>
      <Headline as="h2">{'Standard Colors'}</Headline>
      <Row>{StandardColors}</Row>
      <Headline as="h2">{'Accent Colors'}</Headline>
      <Row>{AccentColors}</Row>
      <Headline as="h2">{'Status Colors'}</Headline>
      <Row>{StatusColors}</Row>
      <Headline as="h2">{'Dark Theme (default) - Foreground'}</Headline>
      <Row>{fgDarkColors}</Row>
      <Headline as="h2">{'Dark Theme (default) - Background'}</Headline>
      <Row>{bgDarkColors}</Row>
      <Headline as="h2">{'Light Theme (dashboard) - Foreground'}</Headline>
      <Row>{fgLightColors}</Row>
      <Headline as="h2">{'Light Theme (dashboard) - Background'}</Headline>
      <Row>{bgLightColors}</Row>
    </>
  );
};
