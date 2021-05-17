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
import PropTypes from 'prop-types';

function TechnologyWeight({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 48 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M47.656 14.143C47.656 13.7509 47.5787 13.2803 47.5787 12.8881C47.5787 12.4176 47.656 11.8686 47.347 11.4764C46.8835 10.849 45.9566 10.9274 45.2614 10.9274C45.2614 9.8294 45.1841 8.73139 45.1841 7.63338C45.1841 6.84909 45.4159 5.59422 44.9524 4.88836C44.1799 3.79035 42.017 3.94721 40.7039 3.86878C40.7039 3.71193 40.7039 3.47664 40.7039 3.31978C40.4721 0.496332 38.9272 0.0257568 36.2236 0.0257568C33.2883 0.0257568 32.5158 1.04534 32.2841 4.02564C32.1296 6.37852 32.0524 8.73139 32.0524 11.0058C29.1943 11.2411 26.1817 10.9274 23.4008 10.9274C20.929 10.9274 18.5344 11.0058 16.0625 11.0843C16.0625 8.73139 15.9853 6.45694 15.8308 4.10407C15.599 1.20219 14.8266 0.104186 11.8912 0.104186C9.80561 0.104186 7.71997 0.339473 7.41099 2.69235C7.33375 3.16292 7.33375 3.6335 7.2565 4.02564C5.94332 4.02564 3.93494 3.94721 3.23973 4.88836C2.23553 6.14323 2.69901 9.43725 2.69901 10.849C2.69901 10.9274 2.69901 10.9274 2.69901 11.0058C2.08104 11.0058 1.38583 10.9274 0.922356 11.1627C0.0726539 11.5548 0.381637 13.045 0.381637 13.8293C0.381637 14.6136 0.1499 15.8684 1.07685 16.0253C1.54032 16.1037 2.08104 16.1822 2.54451 16.1037C2.54451 17.9076 2.62176 19.7899 3.08523 21.3585C3.54871 23.3976 5.47985 23.3976 7.33375 23.3976C7.33375 23.6329 7.33375 23.9466 7.41099 24.1819C7.64273 26.6917 9.03315 26.9269 11.196 26.9269C12.5865 26.9269 14.8266 27.476 15.6763 25.9858C16.1398 25.1231 16.0625 23.6329 16.0625 22.6918C16.1398 20.6526 16.1398 18.6135 16.0625 16.5743C16.0625 16.4174 16.0625 16.2606 16.0625 16.1037C21.3152 16.0253 26.7224 16.339 31.9751 16.0253C31.9751 17.8292 31.9751 19.7115 31.9751 21.5153C31.9751 22.6918 31.8206 24.1819 32.2068 25.3584C32.8248 27.3191 35.0649 26.8485 36.7643 26.8485C38.6182 26.8485 40.2404 26.9269 40.7039 24.7309C40.7811 24.2604 40.8584 23.7898 40.8584 23.3192C42.635 23.3192 44.5662 23.2408 45.0296 21.3585C45.4159 19.8683 45.4931 18.0645 45.4159 16.339C46.0338 16.339 46.729 16.339 47.1925 16.1037C47.8105 15.7116 47.656 14.7704 47.656 14.143ZM1.46308 15.0057C1.38583 14.5351 1.46308 13.9861 1.46308 13.5156C1.46308 13.2018 1.46308 12.9666 1.46308 12.6528C1.46308 12.5744 1.54032 12.1823 1.46308 12.1823C1.61757 12.1038 2.08104 12.1823 2.15829 12.1823C2.31278 12.1823 2.54451 12.1823 2.69901 12.1823C2.69901 13.1234 2.62176 14.143 2.62176 15.1626C2.23553 15.0841 1.77206 15.0841 1.46308 15.0057ZM4.08943 20.4958C3.85769 19.633 3.93494 18.6919 3.93494 17.8292C3.78045 15.5547 3.78045 13.2018 3.78045 10.849C3.78045 9.51568 3.62595 7.86867 3.93494 6.53537C4.32117 4.96679 5.78883 5.12365 7.2565 5.12365C7.17925 7.71181 7.41099 10.3 7.41099 12.8097C7.33375 15.9469 7.17925 19.1625 7.33375 22.2996C5.5571 22.2996 4.5529 22.3781 4.08943 20.4958ZM14.9811 23.5545C14.9038 24.7309 15.0583 25.5937 13.8224 25.9074C13.1272 26.0642 12.123 25.9074 11.4278 25.9074C10.1146 25.9074 8.87866 25.2799 8.49243 23.9466C8.26069 22.9271 8.49243 21.4369 8.49243 20.4173C8.49243 17.9076 8.41518 15.3979 8.49243 12.8881C8.49243 11.2411 8.49243 9.59411 8.41518 7.9471C8.41518 6.6138 8.49243 5.35894 8.49243 4.02564C8.49243 1.82963 9.88285 1.35905 11.814 1.35905C12.7409 1.35905 13.9769 1.82963 14.5176 2.69235C14.8266 3.16292 14.6721 4.41779 14.6721 5.04522C14.7493 6.30009 14.7493 7.63338 14.8266 8.88825C14.9038 11.3196 14.9811 13.8293 14.9811 16.2606C15.0583 18.6135 15.1356 21.1232 14.9811 23.5545ZM16.0625 15.0841C16.0625 14.143 16.0625 13.2018 16.0625 12.2607C18.4571 12.1823 20.929 12.1823 23.4008 12.1038C26.2589 12.1038 29.2715 12.4176 32.0524 12.1823C32.0524 13.1234 32.0524 14.0646 32.0524 15.0057C26.7224 15.241 21.3925 15.0057 16.0625 15.0841ZM39.6997 7.71181C39.6224 9.35882 39.6224 11.0058 39.6224 12.6528C39.6997 15.0057 39.6224 17.3586 39.6224 19.7115C39.6224 22.2996 40.3949 25.6721 36.7643 25.7505C36.1464 25.7505 35.0649 25.9858 34.447 25.7505C32.8248 25.0446 33.1338 23.7114 33.0565 22.3781C32.9793 20.0252 32.9793 17.7507 33.0565 15.3979C33.0565 12.9666 33.1338 10.6137 33.211 8.18239C33.2883 5.59422 32.5158 1.12376 36.2236 1.12376C38.3865 1.12376 39.2362 1.90806 39.6224 4.1825C39.8542 5.35894 39.6997 6.53537 39.6997 7.71181ZM44.1799 17.986C44.1799 18.7703 44.2572 19.7115 44.0254 20.4173C43.562 22.2212 42.4033 22.1428 40.8584 22.1428C40.8584 20.9663 40.7039 19.7899 40.7811 18.6919C40.7811 16.6527 40.7811 14.6136 40.7811 12.5744C40.7039 9.98626 40.9356 7.47652 40.8584 4.88836C41.5536 4.88836 42.2488 4.88836 42.8667 5.04522C44.1027 5.35894 44.1027 5.5158 44.1799 6.84909C44.3344 8.57453 44.1799 10.3784 44.2572 12.0254C44.1799 14.143 44.1799 16.1037 44.1799 17.986ZM45.3386 15.1626C45.2614 14.143 45.2614 13.1234 45.2614 12.1823C45.2614 12.1038 45.2614 12.0254 45.2614 12.0254C45.4931 12.0254 45.7248 12.0254 46.0338 12.0254C46.42 12.0254 46.42 11.947 46.4973 12.2607C46.5745 12.496 46.4973 12.8881 46.4973 13.1234C46.4973 13.4371 46.5745 13.7509 46.5745 14.0646C46.5745 14.2999 46.5745 14.5351 46.5745 14.8489C46.5745 14.8489 46.5745 15.0057 46.5745 15.0841H46.4973C46.1111 15.0841 45.7248 15.1626 45.3386 15.1626Z"
        fill="white"
      />
      <path
        d="M9.57278 3.86881C9.03206 5.12367 9.18655 6.69225 9.34104 8.02555C9.41829 8.73141 10.4997 8.73141 10.4225 8.02555C10.268 6.84911 10.1135 5.35896 10.577 4.18252C10.886 3.55509 9.88176 3.24137 9.57278 3.86881Z"
        fill="white"
      />
      <path
        d="M11.0405 2.30007C10.3453 2.30007 10.3453 3.39808 11.0405 3.39808C11.7357 3.39808 11.7357 2.30007 11.0405 2.30007Z"
        fill="white"
      />
      <path
        d="M34.5231 3.39831C34.1369 3.94731 34.1369 4.7316 34.0597 5.35904C33.9824 6.14333 33.9052 6.92762 33.9824 7.71191C34.0597 8.41777 35.1411 8.41777 35.0639 7.71191C34.9866 7.08448 35.0639 6.37861 35.0639 5.75118C35.1411 5.20218 35.1411 4.41789 35.4501 3.94731C35.9136 3.39831 34.9866 2.8493 34.5231 3.39831Z"
        fill="white"
      />
      <path
        d="M36.068 1.98648C35.3728 1.98648 35.3728 3.08449 36.068 3.08449C36.7633 3.08449 36.7633 1.98648 36.068 1.98648Z"
        fill="white"
      />
    </svg>
  );
}

TechnologyWeight.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 48 / 28,
  svg: TechnologyWeight,
};