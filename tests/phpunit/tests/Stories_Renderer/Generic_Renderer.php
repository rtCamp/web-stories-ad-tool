<?php
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

namespace Google\Web_Stories\Tests\Stories_Renderer;

use Google\Web_Stories\Stories_Renderer\Generic_Renderer as Testee;
use Google\Web_Stories\Stories;

class Generic_Renderer extends \WP_UnitTestCase_Base {

	/**
	 * Object of class in test.
	 *
	 * @var Generic_Renderer
	 */
	private $testee;

	/**
	 * Stories mock object.
	 *
	 * @var Stories_Mock
	 */
	private $stories;

	/**
	 * Story post ID.
	 *
	 * @var int
	 */
	private static $story_id;

	/**
	 * Runs once before any test in the class run.
	 *
	 * @param WP_UnitTest_Factory $factory Factory class object.
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		self::$story_id       = $factory->post->create(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_title'   => 'Example title',
				'post_status'  => 'publish',
				'post_content' => 'Example content',
			]
		);

	}

	/**
	 * Runs once before any test in the class run.
	 */
	public function setUp(): void {
		$this->stories = $this->createMock( Stories::class );
		$this->stories->method( 'get_stories' )->willReturn( [ get_post( self::$story_id ) ] );
		$this->stories->method( 'get_story_attributes' )->willReturn(
			[
				'class'             => 'dummy',
				'show_story_poster' => true,
			]
		);

		$this->testee  = new Testee( $this->stories );
	}

	/**
	 * Check that setup adds necessary hooks.
	 */
	public function test_setup_hooks_added() {
		$this->testee->setup();

		$this->assertSame( 10, has_action( 'ws_renderer_container_start', [ $this->testee, 'amp_carousel' ] ) );
		$this->assertSame( 10, has_action( 'ws_renderer_container_end', [ $this->testee, 'amp_carousel' ] ) );
		$this->assertSame( 10, has_action( 'ws_renderer_content', [ $this->testee, 'render_story' ] ) );
		$this->assertSame( 10, has_action( 'ws_renderer_wrapper_end', [ $this->testee, 'maybe_render_archive_link' ] ) );
		$this->assertSame( 10, has_action( 'ws_story_content_overlay', [ $this->testee, 'get_content_overlay' ] ) );
		$this->assertSame( 10, has_action( 'ws_single_story_content', [ $this->testee, 'render_story_with_poster' ] ) );
		$this->assertSame( 10, has_action( 'ws_single_story_content', [ $this->testee, 'render_story_with_story_player' ] ) );
		$this->assertSame( 10, has_action( 'ws_renderer_container_classes', [ $this->testee, 'container_classes' ] ) );
		$this->assertSame( 10, has_action( 'ws_renderer_container_style', [ $this->testee, 'container_styles' ] ) );
		$this->assertSame( 10, has_action( 'ws_single_story_classes', [ $this->testee, 'single_story_classes' ] ) );
	}
}
