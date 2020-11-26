class Lightbox {
	constructor( wrapperDiv ) {
    if('undefined' === typeof wrapperDiv){
      return;
    }

    this.wrapperDiv = wrapperDiv;
    this.player = this.wrapperDiv.querySelector('amp-story-player');
    this.lightboxElement = this.wrapperDiv.querySelector('.web-stories__lightbox');

    if('undefined' === typeof this.player || 'undefined' === typeof this.lightboxElement) {
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
    const cards = this.wrapperDiv.querySelectorAll('.web-stories__story-wrapper');

    cards.forEach((card, index) => {
      card.addEventListener('click', () => {
        this.player.show(this.stories[index].href);
        this.lightboxElement.classList.toggle('show');
      });
    });

  }
};

export default function initializeWebStoryLightbox() {
  const webStoryBlocks = document.getElementsByClassName('web-stories'); // Replace with our generic wrapper class name.
  if('undefined' !== typeof webStoryBlocks){
    Array.from(webStoryBlocks).forEach((webStoryBlock) => {
      new Lightbox(webStoryBlock);
    })
  }
}
