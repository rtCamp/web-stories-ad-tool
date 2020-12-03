/**
 * Set the settings for stories in MCE.
 *
 * @param settings
 * @returns {{settings: Object, type: string}}
 */
export function setSettings( settings ) {
  return {
    type: 'SET_SETTINGS',
    settings: settings
  }
}

export function toggleModal( open ) {
  return {
    type: 'TOGGLE_MODAL',
    modalOpen: open
  }
}

export function setEditor( editor ) {
  return {
    type: 'SET_EDITOR',
    editor: editor
  }
}
