import name from "../store/name";
import WebStoriesModal from "../components/Modal";

const { withSelect } = wp.data;
const { compose  } = wp.compose;

/**
 * Pass extended props to the Modal component.
 *
 * @param select
 * @returns {{categories: Array}}
 */
const mapSelectToProps = ( select ) => {
  return {
    categories: select( 'core' ).getEntityRecords( 'taxonomy', 'category' ),
    modalOpen: select( name ).getModal(),
    settings: select( name ).getSettings()
  }
};

/**
 * Higher-order component.
 */
export default compose(
  [
    withSelect( mapSelectToProps ),
  ]
)( WebStoriesModal );
