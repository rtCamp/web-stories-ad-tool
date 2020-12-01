<?php
/**
 * Class Embed_Block.
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

namespace Google\Web_Stories\Block;

use Google\Web_Stories\Media;
use Google\Web_Stories\Story_Query;
use Google\Web_Stories\Tracking;
use Google\Web_Stories\Embed_Base;
use Google\Web_Stories\Story_Post_Type;

/**
 * Latest Stories block class.
 */
class Latest_Stories_Block extends Embed_Base {
	/**
	 * Script handle.
	 *
	 * @var string
	 */
	const SCRIPT_HANDLE = 'latest-web-stories-block';

	/**
	 * Block name.
	 *
	 * @var string
	 */
	const BLOCK_NAME = 'web-stories/latest-stories';

	/**
	 * Current block's block attributes.
	 *
	 * @var array Block Attributes.
	 */
	protected $block_attributes = [];

	/**
	 * Initializes the Web Stories embed block.
	 *
	 * @since
	 *
	 * @return void
	 */
	public function init() {
		$this->register_script( self::SCRIPT_HANDLE, [ self::STORY_PLAYER_HANDLE, Tracking::SCRIPT_HANDLE ] );
		$this->register_style( self::SCRIPT_HANDLE, [ self::STORY_PLAYER_HANDLE ] );

		wp_localize_script(
			self::SCRIPT_HANDLE,
			'webStoriesLatestBlockSettings',
			$this->get_script_settings()
		);

		// todo: use register_block_type_from_metadata() once generally available.
		register_block_type(
			self::BLOCK_NAME,
			[
				'attributes'      => [
					'align'                => [
						'type'    => 'string',
						'default' => 'none',
					],
					'viewType'             => [
						'type'    => 'string',
						'default' => 'grid',
					],
					'numOfStories'         => [
						'type'    => 'number',
						'default' => 5,
					],
					'numOfColumns'         => [
						'type'    => 'number',
						'default' => 2,
					],
					'orderByValue'         => [
						'type'    => 'string',
						'default' => '',
					],
					'isShowingTitle'       => [
						'type'    => 'boolean',
						'default' => true,
					],
					'isShowingDate'        => [
						'type'    => 'boolean',
						'default' => false,
					],
					'isShowingAuthor'      => [
						'type'    => 'boolean',
						'default' => false,
					],
					'isShowingViewAll'     => [
						'type'    => 'boolean',
						'default' => false,
					],
					'viewAllLinkLabel'     => [
						'type'    => 'string',
						'default' => '',
					],
					'isShowingStoryPlayer' => [
						'type'    => 'boolean',
						'default' => false,
					],
					'authors'              => [
						'type'    => 'array',
						'default' => [],
					],
					'imageOnRight'         => [
						'type'    => 'boolean',
						'default' => false,
					],
					'isStyleSquared'       => [
						'type'    => 'boolean',
						'default' => false,
					],
				],
				'render_callback' => [ $this, 'render_block' ],
				'editor_script'   => self::SCRIPT_HANDLE,
				'editor_style'    => self::SCRIPT_HANDLE,
			]
		);
	}

	/**
	 * Returns script settings.
	 *
	 * @since
	 *
	 * @return array Script settings.
	 */
	private function get_script_settings() {
		return [
			'publicPath' => WEBSTORIES_PLUGIN_DIR_URL . 'assets/js/',
		];
	}

	/**
	 * Initializes class variable $block_attributes.
	 *
	 * @since
	 *
	 * @param array $block_attributes Array containing block attributes.
	 *
	 * @return bool Whether or not block attributes have been initialized with given value.
	 */
	protected function initialize_block_attributes( $block_attributes = [] ) {
		if ( ! empty( $block_attributes ) || ! is_array( $block_attributes ) ) {
			$this->block_attributes = $block_attributes;
			return true;
		}
		return false;
	}

	/**
	 * Renders the block type output for given attributes.
	 *
	 * @since
	 *
	 * @param array $attributes Block attributes.
	 *
	 * @return string Rendered block type output.*
	 */
	public function render_block( array $attributes ) {

		if ( false === $this->initialize_block_attributes( $attributes ) ) {
			return '';
		}

		$story_attributes = [
			'align'                     => ! empty( $attributes['align'] ) ? $attributes['align'] : 'none',
			'view_type'                 => ! empty( $attributes['viewType'] ) ? $attributes['viewType'] : 'circles',
			'number_of_columns'         => ! empty( $attributes['numOfColumns'] ) ? $attributes['numOfColumns'] : 3,
			'show_title'                => ! empty( $attributes['isShowingTitle'] ) ? $attributes['isShowingTitle'] : false,
			'show_date'                 => ! empty( $attributes['isShowingDate'] ) ? $attributes['isShowingDate'] : false,
			'show_author'               => ! empty( $attributes['isShowingAuthor'] ) ? $attributes['isShowingAuthor'] : false,
			'show_stories_archive_link' => ! empty( $attributes['isShowingViewAll'] ) ? $attributes['isShowingViewAll'] : false,
			'stories_archive_label'     => ! empty( $attributes['viewAllLinkLabel'] ) ? $attributes['viewAllLinkLabel'] : __( 'View all stories', 'web-stories' ),
			'show_story_player'         => ! empty( $attributes['isShowingStoryPlayer'] ) ? $attributes['isShowingStoryPlayer'] : false,
			'list_view_image_alignment' => ! empty( $attributes['imageOnRight'] ) ? 'right' : 'left',
			'has_square_corners'        => ! empty( $attributes['isStyleSquared'] ) ? $attributes['isStyleSquared'] : false,
		];

		$stories = new Story_Query( $story_attributes, $this->get_query_args() );

		return $stories->render();
	}

	/**
	 * Returns arguments to be passed to the WP_Query object initialization.
	 *
	 * @since
	 *
	 * @param array $attributes Current block's attributes. If not passed, will use attributes stored in class variable.
	 *
	 * @return array Query arguments.
	 */
	protected function get_query_args( array $attributes = [] ) {

		if ( empty( $attributes ) ) {
			$attributes = $this->block_attributes;
		}

		if ( empty( $attributes ) ) {
			return [];
		}

		$query_args     = [
			'post_type'        => Story_Post_Type::POST_TYPE_SLUG,
			'posts_per_page'   => 10,
			'post_status'      => 'publish',
			'suppress_filters' => false,
			'no_found_rows'    => true,
		];
		$order_by_value = ( ! empty( $attributes['orderByValue'] ) ) ? $attributes['orderByValue'] : '';
		$num_of_stories = ( ! empty( $attributes['numOfStories'] ) ) ? absint( $attributes['numOfStories'] ) : '';

		if ( ! empty( $num_of_stories ) ) {
			$query_args['posts_per_page'] = $num_of_stories;
		}

		if ( ! empty( $order_by_value ) ) {
			switch ( $order_by_value ) {
				case 'old-to-new':
					$query_args['order'] = 'ASC';
					break;
				case 'alphabetical':
					$query_args['orderby'] = 'title';
					$query_args['order']   = 'ASC';
					break;
				case 'reverse-alphabetical':
					$query_args['orderby'] = 'title';
					$query_args['order']   = 'DESC';
					break;
				case 'random':
					$query_args['orderby'] = 'rand';
					$query_args['order']   = 'DESC';
					break;
			}
		}

		if ( ! empty( $attributes['authors'] ) && is_array( $attributes['authors'] ) ) {
			$author_ids = wp_list_pluck( $attributes['authors'], 'id' );

			if ( ! empty( $author_ids ) && is_array( $author_ids ) ) {
				$query_args['author__in'] = $author_ids;
			}
		}

		return $query_args;
	}

}
