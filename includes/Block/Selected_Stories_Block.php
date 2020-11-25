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

use Google\Web_Stories\Tracking;
use Google\Web_Stories\Story_Post_Type;

/**
 * Selected Stories block class.
 */
class Selected_Stories_Block extends Latest_Stories_Block {
	/**
	 * Script handle.
	 *
	 * @var string
	 */
	const SCRIPT_HANDLE = 'selected-web-stories-block';

	/**
	 * Style handle.
	 *
	 * @var string
	 */
	const STYLE_HANDLE = 'selected-stories-block-style';

	/**
	 * Block name.
	 *
	 * @var string
	 */
	const BLOCK_NAME = 'web-stories/selected-stories';

	/**
	 * Current block's block attributes.
	 *
	 * @var array Block Attributes.
	 */
	protected $block_attributes = [];

	/**
	 * Maximum number of stories users can select
	 *
	 * @var int
	 */
	protected $max_num_of_stories = 20;

	/**
	 * Initializes the Web Stories embed block.
	 *
	 * @since
	 *
	 * @return void
	 */
	public function init() {
		/**
		 * Filters the maximum number of stories users can select
		 *
		 * @since
		 *
		 * @param int $max_num_of_stories
		 */
		$this->max_num_of_stories = apply_filters( 'web_stories_selected_stories_limit', $this->max_num_of_stories );

		$this->register_script( self::SCRIPT_HANDLE, [ self::STORY_PLAYER_HANDLE, Tracking::SCRIPT_HANDLE ] );
		$this->register_style( parent::SCRIPT_HANDLE, [ self::STORY_PLAYER_HANDLE ] );

		wp_register_style(
			parent::STYLE_HANDLE,
			WEBSTORIES_PLUGIN_DIR_URL . 'includes/assets/latest-stories.css',
			[],
			'v0',
			false
		);

		wp_localize_script(
			self::SCRIPT_HANDLE,
			'webStoriesSelectedBlockSettings',
			$this->get_script_settings()
		);

		// todo: use register_block_type_from_metadata() once generally available.
		register_block_type(
			self::BLOCK_NAME,
			[
				'attributes'      => [
					'stories'              => [
						'type'    => 'array',
						'default' => [],
					],
					'align'                => [
						'type'    => 'string',
						'default' => 'none',
					],
					'viewType'             => [
						'type'    => 'string',
						'default' => 'grid',
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
					'carouselSettings'     => [
						'type'    => 'object',
						'default' => [
							'autoplay' => false,
							'delay'    => '',
							'loop'     => false,
						],
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
				'style'           => self::STYLE_HANDLE,
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
		$rest_base = Story_Post_Type::POST_TYPE_SLUG;

		return [
			'publicPath' => WEBSTORIES_PLUGIN_DIR_URL . 'assets/js/',
			'authors'    => $this->get_story_authors(),
			'config'     => [
				'maxNumOfStories' => $this->max_num_of_stories,
				'api'             => [
					'stories' => sprintf( '/web-stories/v1/%s', $rest_base ),
				],
			],
		];
	}

	/**
	 * Get a list of story authors
	 *
	 * @since
	 *
	 * @return array Author list
	 */
	protected function get_story_authors() {
		// @see Roles listed in \Google\Web_Stories\Story_Post_Type::add_caps_to_roles() method
		return get_users(
			[
				'role__in' => [ 'administrator', 'editor', 'author', 'contributor' ],
				'orderby'  => 'display_name',
				'number'   => -1,
				'fields'   => [ 'ID', 'display_name' ],
			]
		);
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

		if ( empty( $attributes ) || empty( $attributes['stories'] ) ) {
			return [];
		}

		$query_args = [
			'post_type'      => Story_Post_Type::POST_TYPE_SLUG,
			'posts_per_page' => $this->max_num_of_stories,
			'post_status'    => 'publish',
			'no_found_rows'  => true,
			'fields'         => 'ids',
			'post__in'       => $attributes['stories'],
			'orderby'        => 'post__in',
		];

		return $query_args;
	}
}
