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
use Google\Web_Stories\Embed_Base;
use Google\Web_Stories\Story_Post_Type;

/**
 * Latest Stories block class.
 */
class Web_Stories_Block extends Embed_Base {

	/**
	 * Script handle.
	 *
	 * @var string
	 */
	const SCRIPT_HANDLE = 'web-stories-block';

	/**
	 * Block name.
	 *
	 * @var string
	 */
	const BLOCK_NAME = 'web-stories/block';

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
		$this->register_script( self::SCRIPT_HANDLE, [ self::STORY_PLAYER_HANDLE, Tracking::SCRIPT_HANDLE ] );
		$this->register_style( self::SCRIPT_HANDLE, [ self::STORY_PLAYER_HANDLE ] );

		wp_localize_script(
			self::SCRIPT_HANDLE,
			'webStoriesBlockSettings',
			$this->get_script_settings()
		);

		// todo: use register_block_type_from_metadata() once generally available.

		// Note: does not use 'script' and 'style' args, and instead uses 'render_callback'
		// to enqueue these assets only when needed.
		register_block_type(
			self::BLOCK_NAME,
			[
				'attributes'      => [
					'blockType'            => [
						'type' => 'string',
					],
					'url'                  => [
						'type' => 'string',
					],
					'title'                => [
						'type'    => 'string',
						'default' => __( 'Web Story', 'web-stories' ),
					],
					'poster'               => [
						'type' => 'string',
					],
					'width'                => [
						'type'    => 'number',
						'default' => 360,
					],
					'height'               => [
						'type'    => 'number',
						'default' => 600,
					],
					'align'                => [
						'type'    => 'string',
						'default' => 'none',
					],
					'stories'              => [
						'type'    => 'array',
						'default' => [],
					],
					'viewType'             => [
						'type'    => 'string',
						'default' => '',
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
}
