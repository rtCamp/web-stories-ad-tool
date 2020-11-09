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

/**
 * Renderer class.
 */
class Renderer {

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
	 * Returns story item data.
	 *
	 * @since
	 *
	 * @param array  $story_id             Story's id for which the story attributes are requested.
	 * @param string $single_story_classes Single story's classes.
	 *
	 * @return array
	 */
	protected function get_story_item_data( $story_id, $single_story_classes = '' ) {

		$story_attrs = [];

		if ( empty( $story_id ) ) {
			return $story_attrs;
		}

		$is_circles_view = $this->is_view_type( 'circles' );
		$image_size      = $is_circles_view ? Media::POSTER_SQUARE_IMAGE_SIZE : Media::POSTER_PORTRAIT_IMAGE_SIZE;
		$story_title     = ( ! empty( $this->attributes['show_title'] ) && ( true === $this->attributes['show_title'] ) ) ?
			get_the_title( $story_id ) :
			'';
		$author_name     = ( ! $is_circles_view && ! empty( $this->attributes['show_author'] ) && ( true === $this->attributes['show_author'] ) ) ?
			get_the_author_meta( 'display_name' ) :
			'';
		$story_date      = ( ! $is_circles_view && ! empty( $this->attributes['show_date'] ) && ( true === $this->attributes['show_date'] ) ) ?
			get_the_date( 'M j, Y' ) :
			'';

		$story_attrs['ID']                   = $story_id;
		$story_attrs['url']                  = get_post_permalink( $story_id );
		$story_attrs['title']                = $story_title;
		$story_attrs['height']               = '430';
		$story_attrs['width']                = '285';
		$story_attrs['poster']               = get_the_post_thumbnail_url( $story_id, $image_size );
		$story_attrs['author']               = $author_name;
		$story_attrs['date']                 = $story_date;
		$story_attrs['class']                = ( is_string( $single_story_classes ) ? $single_story_classes : '' );
		$story_attrs['show_content_overlay'] = ( ! empty( $story_title ) || ! empty( $author_name ) || ! empty( $story_date ) );

		return $story_attrs;
	}

	/**
	 * Returns 'post_content_filtered' field for current post or for the post of given id.
	 *
	 * @since
	 *
	 * @param int $post_id Post id of the post for which the field value is required. If not passed, will
	 *                     try and get current post in the loop.
	 *
	 * @return object 'post_content_filtered' field's value.
	 */
	protected function get_post_content_filtered( $post_id = null ) {

		$post_content_filtered = new \stdClass();
		$post_obj              = get_post( $post_id );

		if ( empty( $post_obj ) || ! is_a( $post_obj, 'WP_Post' ) ) {
			return $post_content_filtered;
		}

		$post_id = $post_obj->ID;

		if ( empty( $post_id ) && empty( get_the_ID() ) ) {
			return $post_content_filtered;
		}

		$post_content_filtered = json_decode( get_post_field( 'post_content_filtered', $post_id ) );

		return $post_content_filtered;

	}

	/**
	 * Verifies the current view type.
	 *
	 * @since
	 *
	 * @param string $view_type View type to check.
	 *
	 * @return bool Whether or not current view type matches the one passed.
	 */
	protected function is_view_type( $view_type ) {
		return ( ! empty( $this->attributes['view_type'] ) && $view_type === $this->attributes['view_type'] );
	}

	/**
	 * Returns image source url of the poster for current post. If poster isn't present, will fallback to first image on first page of the story.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return string image source url.
	 */
	protected function get_fallback_story_poster( $post_id ) {
		$thumbnail_url         = '';
		$post_content_filtered = $this->get_post_content_filtered( $post_id );

		if ( empty( $post_content_filtered->pages ) ) {
			return $thumbnail_url;
		}

		$first_page = $post_content_filtered->pages[0];

		if ( empty( $first_page->elements ) || ! is_array( $first_page->elements ) ) {
			return $thumbnail_url;
		}

		foreach ( $first_page->elements as $element ) {
			if ( 'image' === $element->type && 'image' === $element->resource->type ) {
				$thumbnail_url = $element->resource->src;
				break;
			}
		}

		return $thumbnail_url;
	}

}
