<?php
/**
 * Stories Renderer Base class.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

namespace Google\Web_Stories\Stories_Renderer;

use Google\Web_Stories\Media;
use Google\Web_Stories\Interfaces\Renderer as RenderingInterface;
use Google\Web_Stories\Stories;

/**
 * Renderer class.
 */
abstract class Renderer implements RenderingInterface {
	/**
	 * Web Stories stylesheet handle.
	 *
	 * @var string
	 */
	const STYLE_HANDLE = 'web-stories-styles';

	/**
	 * Stories object
	 *
	 * @var Stories Stories object
	 */
	protected $stories;

	/**
	 * Story attributes
	 *
	 * @var array An array of story attributes.
	 */
	protected $attributes = [];

	/**
	 * Constructor
	 *
	 * @param Stories $stories Stories instance.
	 */
	public function __construct( Stories $stories ) {
		$this->stories    = $stories;
		$this->attributes = $this->stories->get_story_attributes();
	}

	/**
	 * Output markup for amp stories.
	 *
	 * @return string
	 */
	abstract public function render();

	/**
	 * Perform initial setup for object.
	 *
	 * @return void
	 */
	public function init() {}

	/**
	 * Initializes renderer functionality.
	 *
	 * @return void
	 */
	public function assets() {
		wp_enqueue_style(
			self::STYLE_HANDLE,
			WEBSTORIES_PLUGIN_DIR_URL . 'includes/assets/stories.css',
			[],
			'v0'
		);
	}

	/**
	 * Determine whether the current request is for an AMP page.
	 *
	 * @return boolean
	 */
	public function is_amp_request() {
		return ( function_exists( 'amp_is_request' ) && amp_is_request() ) ||
		( function_exists( 'is_amp_endpoint' ) && is_amp_endpoint() );
	}

	/**
	 * Returns story item data.
	 *
	 * @since
	 *
	 * @param int    $story_id             Story's id for which the story attributes are requested.
	 * @param string $single_story_classes Single story's classes.
	 *
	 * @return array Returns single story item data.
	 */
	protected function get_story_item_data( $story_id, $single_story_classes = '' ) {

		$story_data = [];

		if ( empty( $story_id ) ) {
			return $story_data;
		}

		$author_id       = absint( get_post_field( 'post_author', $story_id ) );
		$is_circles_view = $this->is_view_type( 'circles' );
		$image_size      = $is_circles_view ? Media::POSTER_SQUARE_IMAGE_SIZE : Media::POSTER_PORTRAIT_IMAGE_SIZE;
		$story_title     = ( ! empty( $this->attributes['show_title'] ) && ( true === $this->attributes['show_title'] ) ) ?
			get_the_title( $story_id ) :
			'';
		$author_name     = ( ! $is_circles_view && ! empty( $this->attributes['show_author'] ) && ( true === $this->attributes['show_author'] ) ) ?
			get_the_author_meta( 'display_name', $author_id ) :
			'';
		$story_date      = ( ! $is_circles_view && ! empty( $this->attributes['show_date'] ) && ( true === $this->attributes['show_date'] ) ) ?
			get_the_date( 'M j, Y', $story_id ) :
			'';

		$story_data['ID']                   = $story_id;
		$story_data['url']                  = get_post_permalink( $story_id );
		$story_data['title']                = $story_title;
		$story_data['height']               = '430';
		$story_data['width']                = '285';
		$story_data['poster']               = get_the_post_thumbnail_url( $story_id, $image_size );
		$story_data['author']               = $author_name;
		$story_data['date']                 = $story_date;
		$story_data['class']                = $single_story_classes;
		$story_data['show_content_overlay'] = ( ! empty( $story_title ) || ! empty( $author_name ) || ! empty( $story_date ) );

		return $story_data;
	}

	/**
	 * Verifies the current view type.
	 *
	 * @param string $view_type View type to check.
	 *
	 * @return bool Whether or not current view type matches the one passed.
	 */
	protected function is_view_type( $view_type ) {
		return ( ! empty( $this->attributes['view_type'] ) && $view_type === $this->attributes['view_type'] );
	}

	/**
	 * Get view type for stories.
	 *
	 * @return string
	 */
	protected function get_view_type() {
		return isset( $this->attributes['view_type'] ) ? $this->attributes['view_type'] : '';
	}
}
