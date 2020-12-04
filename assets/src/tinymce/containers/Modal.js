import { forEach } from "lodash";

import name from "../store/name";
import WebStoriesModal from "../components/Modal";

const { withSelect, select } = wp.data;
const { compose  } = wp.compose;
const { webStoriesMCEData } = window;

const prepareShortCode = () => {
  let shortCode = '[' + webStoriesMCEData.tag;
  const editorInstance = select(name).getEditor();
  const settings = select(name).getSettings();

  if ( editorInstance ) {
    forEach( settings, ( value, index ) => {
      shortCode =  shortCode + ' ' + index.toString() + '=' + value.toString();
    })
  }

  shortCode = shortCode + ' /]';

  return shortCode;
}

/**
 * Pass extended props to the Modal component.
 *
 * @param select
 * @returns {{categories: Array}}
 */
const mapSelectToProps = ( select ) => {
  return {
    modalOpen: select( name ).getModal(),
    settings: select( name ).getCurrentViewSettings(),
    prepareShortCode: prepareShortCode
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
