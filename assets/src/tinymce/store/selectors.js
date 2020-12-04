import { select } from "@wordpress/data";
import name from "./name";

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

/**
 * Get Modal state.
 *
 * @param state
 * @returns {boolean}
 */
export function getModal( state ) {
  return state.modalOpen;
}

/**
 * Get editor instance.
 *
 * @param state
 */
export function getEditor( state ) {
  return state.editor;
}

export function getCurrentView( state ) {
  return state.currentView;
}

export function getCurrentViewSettings( state ) {
  const currentView = select(name).getCurrentView();

  return state.settings[currentView];
}
