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
class Lightbox {
  constructor(wrapperDiv) {
    if ('undefined' === typeof wrapperDiv) {
      return;
    }

    this.wrapperDiv = wrapperDiv;
    this.player = this.wrapperDiv.querySelector('amp-story-player');
    this.lightboxElement = this.wrapperDiv.querySelector(
      '.web-stories__lightbox'
    );

    if (
      'undefined' === typeof this.player ||
      'undefined' === typeof this.lightboxElement
    ) {
      return;
    }

    if (this.player.isReady) {
      this.initializeLightbox();
    }

    this.player.addEventListener('ready', () => {
      this.initializeLightbox();
    });

    // Event triggered when user clicks on close (X) button.
    this.player.addEventListener('amp-story-player-close', () => {
      this.lightboxElement.classList.toggle('show');
    });
  }

  initializeLightbox() {
    this.stories = this.player.getStories();
    this.bindStoryClickListeners();
  }

  bindStoryClickListeners() {
    const cards = this.wrapperDiv.querySelectorAll(
      '.web-stories__story-wrapper'
    );

    cards.forEach((card, index) => {
      card.addEventListener('click', () => {
        this.player.show(this.stories[index].href);
        this.lightboxElement.classList.toggle('show');
      });
    });
  }
}

export default function initializeWebStoryLightbox() {
  const webStoryBlocks = document.getElementsByClassName('web-stories'); // Replace with our generic wrapper class name.
  if ('undefined' !== typeof webStoryBlocks) {
    Array.from(webStoryBlocks).forEach((webStoryBlock) => {
      new Lightbox(webStoryBlock);
    });
  }
}
