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

use Google\Web_Stories\Embed_Base;
use Google\Web_Stories\Tracking;

/**
 * Selected Stories block class.
 */
class Selected_Stories_Block extends Embed_Base {
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
	 * Initializes the Web Stories embed block.
	 *
	 * @since
	 *
	 * @return void
	 */
	public function init() {
		$this->register_script( self::SCRIPT_HANDLE, [ self::STORY_PLAYER_HANDLE, Tracking::SCRIPT_HANDLE ] );
		$this->register_style( self::SCRIPT_HANDLE, [ self::STORY_PLAYER_HANDLE ] );

		wp_register_style(
			self::STYLE_HANDLE,
			WEBSTORIES_PLUGIN_DIR_URL . 'includes/assets/selected-stories.css',
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
				'attributes'      => [],
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
	 * @return string Rendered block type output.*
	 */
	public function render_block() {

		$content = 'Selected stories block content';

		return $content;
	}
}
