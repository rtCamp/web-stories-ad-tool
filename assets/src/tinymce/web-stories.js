import name from "./store/name";
import WebStoryMCEStore from "./store";
import WebStoriesModal from "./containers/Modal";

const { render } = wp.element;
const { domReady } = wp;
const { dispatch } = wp.data;
const { __ } = wp.i18n;

/**
 * Add button to tinyMCE editor.
 */
(function() {
  tinymce.PluginManager.add('web_stories', function( editor ) {
    editor.addButton('web_stories', {
      text: __( 'Web Stories', 'web-stories' ),
      icon: false,
      onclick: function() {
        dispatch( name ).toggleModal( true );
        editor.insertContent('[wdm_shortcode]');
      }
    });
  });
})();

/**
 * Render tinyMCE settings modal.
 *
 * @constructor
 */
const RenderModal = () => {
  const target = document.getElementById( 'web-stories-tinymce' );

  if ( target ) {
    render(<WebStoriesModal/>, target );
  }
};

/**
 * Mount the component when DOM is ready.
 */
domReady( () => RenderModal() );

/**
 * Subscribe to state change in store.
 */
WebStoryMCEStore.subscribe( () => RenderModal() );
