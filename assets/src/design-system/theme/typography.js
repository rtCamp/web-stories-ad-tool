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

// sizes are in px but unit is left off in case calculations are necessary
const themeFonts = {
  primary: "'Google Sans', sans-serif",
};

export const typography = {
  family: { ...themeFonts },
  presets: {
    display: {
      large: {
        weight: 700,
        size: 122,
        lineHeight: 124,
        letterSpacing: -2.4,
      },
      medium: {
        weight: 700,
        size: 58,
        lineHeight: 64,
        letterSpacing: -1.4,
      },
      small: {
        weight: 700,
        size: 36,
        lineHeight: 40,
        letterSpacing: -1,
      },
    },
    heading: {
      xxlarge: {
        weight: 500,
        size: 42,
        lineHeight: 56,
        letterSpacing: 0,
      },
      xlarge: {
        weight: 500,
        size: 36,
        lineHeight: 44,
        letterSpacing: 0,
      },
      large: {
        weight: 500,
        size: 32,
        lineHeight: 40,
        letterSpacing: 0,
      },
      medium: {
        weight: 500,
        size: 28,
        lineHeight: 36,
        letterSpacing: 0,
      },
      small: {
        weight: 500,
        size: 24,
        lineHeight: 32,
        letterSpacing: 0,
      },
      xsmall: {
        weight: 500,
        size: 20,
        lineHeight: 24,
        letterSpacing: 0,
      },
      xxsmall: {
        weight: 500,
        size: 14,
        lineHeight: 20,
        letterSpacing: 0,
      },
    },
    paragraph: {
      xlarge: {
        weight: 400,
        size: 24,
        lineHeight: 32,
        letterSpacing: -0.02,
      },
      large: {
        weight: 400,
        size: 18,
        lineHeight: 24,
        letterSpacing: 0,
      },
      medium: {
        weight: 400,
        size: 16,
        lineHeight: 24,
        letterSpacing: 0,
      },
      small: {
        weight: 400,
        size: 14,
        lineHeight: 20,
        letterSpacing: 0,
      },
      xsmall: {
        weight: 400,
        size: 12,
        lineHeight: 20,
        letterSpacing: 0.16,
      },
    },
  },
};
