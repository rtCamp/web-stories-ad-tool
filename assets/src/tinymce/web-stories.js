/**
 * Main file for TinyMCE button script.
 */

/**
 * Import dependencies.
 */
import { render } from "@wordpress/element";
import { dispatch } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import name from "./store/name";
import WebStoryMCEStore from "./store";
import WebStoriesModal from "./containers/Modal";
import CAROUSEL_IMG from "./images/carousel";

/**
 * Add button to tinyMCE editor.
 */
(function() {
  tinymce.PluginManager.add('web_stories', function( editor ) {
    editor.addButton('web_stories', {
      text: __( 'Web Stories', 'web-stories' ),
      icon: CAROUSEL_IMG,
      onclick: function() {
        dispatch( name ).toggleModal( true );
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
 * Subscribe to state change in store.
 */
WebStoryMCEStore.subscribe( () => RenderModal() );
