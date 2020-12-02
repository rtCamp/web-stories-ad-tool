import DEFAULT_STATE from './default';

/**
 * Store reducer.
 *
 * @param state
 * @param action
 * @returns {{image_options: boolean, number: number, modalOpen: boolean, show_date: boolean, columns: number, show_author: boolean}|{image_options: boolean, number: number, settings: *, modalOpen: boolean, show_date: boolean, columns: number, show_author: boolean}}
 */
function reducer( state = DEFAULT_STATE, action ) {

  switch ( action.type ) {

    case 'SET_SETTINGS':
      return {
        ...state,
        settings: action.settings
      }

    case 'TOGGLE_MODAL':
      return {
        ...state,
        modalOpen: action.modalOpen
      }

    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.categories
      }

    default:
      return state;
  }
}

export default reducer;
