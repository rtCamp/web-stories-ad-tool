/**
 * Retrieve settings.
 *
 * @param state State of store.
 *
 * @return {Object}
 */
export function getSettings( state ) {
  return state.settings;
}

export function getModal( state ) {
  return state.modalOpen;
}
