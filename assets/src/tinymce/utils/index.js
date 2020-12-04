/**
 * Utility functions and objects.
 *
 * @package Google/Web_Stories
 */

import { select } from "@wordpress/data";
import name from "../store/name";

/**
 * Get current view.
 *
 * @returns {string}
 */
export const currentView = () => {
  const settings = select( name ).getSettings();

  return settings.view;
}

/**
 * Check if current view is circle view.
 *
 * @returns {boolean}
 */
export const isCircleView = () => {
  return 'circles' === currentView();
}
