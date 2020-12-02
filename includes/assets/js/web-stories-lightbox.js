class Lightbox {
	constructor( wrapperDiv ) {
    if('undefined' === typeof wrapperDiv){
      return;
    }

    this.lightboxInitialized = false;
    this.wrapperDiv = wrapperDiv;
    this.lightboxElement = this.wrapperDiv.querySelector('.web-stories-list__lightbox');
    this.player = this.lightboxElement.querySelector('amp-story-player');

    if('undefined' === typeof this.player || 'undefined' === typeof this.lightboxElement) {
      return;
    }

    if (this.player.isReady && ! this.lightboxInitialized) {
        this.initializeLightbox();
    }

    this.player.addEventListener('ready', () => {
      if ( ! this.lightboxInitialized ) {
        this.initializeLightbox();
      }
    });

    // Event triggered when user clicks on close (X) button.
    this.player.addEventListener('amp-story-player-close', () => {
      this.player.pause();
      this.lightboxElement.classList.toggle('show');
    });

  }

  initializeLightbox() {
    this.stories = this.player.getStories();
    this.bindStoryClickListeners();
    this.lightboxInitialized = true;
  }

  bindStoryClickListeners() {
    const cards = this.wrapperDiv.querySelectorAll('.web-stories-list__story-wrapper');

    cards.forEach((card, index) => {
      card.addEventListener('click', ( event ) => {
        event.preventDefault();
        this.player.show(this.stories[index].href);
        this.lightboxElement.classList.toggle('show');
      });
    });

  }
};

export default function initializeWebStoryLightbox() {
  const webStoryBlocks = document.getElementsByClassName('web-stories-list');
  if('undefined' !== typeof webStoryBlocks){
    Array.from(webStoryBlocks).forEach((webStoryBlock) => {
      new Lightbox(webStoryBlock);
    })
  }
}
