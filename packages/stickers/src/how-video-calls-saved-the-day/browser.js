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
import { _x } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';

const title = _x('Browser', 'sticker name', 'web-stories');

function BrowserIcon({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 52 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path d="M0.100098 0.5H51.9001V37.5H0.100098V0.5Z" fill="#FFBF0B" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M51.5301 0.87H0.470098V37.13H51.5301V0.87ZM0.100098 0.5V37.5H51.9001V0.5H0.100098Z"
        fill="#398F5E"
      />
      <path
        d="M47.8823 3.49927L49.3285 2.05328L49.535 2.25987L48.0889 3.70586L47.8823 3.49927Z"
        fill="#398F5E"
      />
      <path
        d="M48.0891 2.05298L49.5351 3.49912L49.3285 3.70569L47.8825 2.25955L48.0891 2.05298Z"
        fill="#398F5E"
      />
      <path
        d="M40.8708 2.73242L42.9159 2.73253L42.9159 3.02468L40.8708 3.02457L40.8708 2.73242Z"
        fill="#398F5E"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M45.4139 2.76853L44.5082 2.76848L44.5082 3.52816L45.4139 3.5282L45.4139 2.76853ZM44.2307 2.49097L44.2306 3.80564L45.6914 3.80572L45.6915 2.49104L44.2307 2.49097Z"
        fill="#398F5E"
      />
      <path
        d="M45.1069 1.90674L46.5677 1.90682L46.5676 3.22149L45.1069 3.22141L45.1069 1.90674Z"
        fill="#FFBF0B"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M46.2902 2.1843L45.3844 2.18425L45.3844 2.94393L46.2901 2.94398L46.2902 2.1843ZM45.1069 1.90674L45.1069 3.22141L46.5676 3.22149L46.5677 1.90682L45.1069 1.90674Z"
        fill="#398F5E"
      />
      <path
        d="M3.19546 3.12129C3.19546 3.32298 3.03196 3.48648 2.83028 3.48648C2.62859 3.48648 2.46509 3.32298 2.46509 3.12129C2.46509 2.9196 2.62859 2.7561 2.83028 2.7561C3.03196 2.7561 3.19546 2.9196 3.19546 3.12129Z"
        fill="#398F5E"
      />
      <path
        d="M4.80215 3.12129C4.80215 3.32298 4.63865 3.48648 4.43696 3.48648C4.23528 3.48648 4.07178 3.32298 4.07178 3.12129C4.07178 2.9196 4.23528 2.7561 4.43696 2.7561C4.63865 2.7561 4.80215 2.9196 4.80215 3.12129Z"
        fill="#398F5E"
      />
      <path
        d="M6.40884 3.12129C6.40884 3.32298 6.24534 3.48648 6.04365 3.48648C5.84197 3.48648 5.67847 3.32298 5.67847 3.12129C5.67847 2.9196 5.84197 2.7561 6.04365 2.7561C6.24534 2.7561 6.40884 2.9196 6.40884 3.12129Z"
        fill="#398F5E"
      />
      <path
        d="M0.100098 5.07617H51.9001V5.44617H0.100098V5.07617Z"
        fill="#398F5E"
      />
    </svg>
  );
}

BrowserIcon.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 52 / 38,
  svg: BrowserIcon,
  title,
};
