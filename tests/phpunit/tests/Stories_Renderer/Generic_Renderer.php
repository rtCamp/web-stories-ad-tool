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

use Google\Web_Stories\Stories;
/**
 * @coversDefaultClass \Google\Web_Stories\Stories_Renderer\Generic_Renderer
 */
class Generic_Renderer extends \WP_UnitTestCase_Base {

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
		self::$story_id = $factory->post->create(
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
	public function setUp() {
		$this->stories = $this->createMock( Stories::class );
		$this->stories->method( 'get_stories' )->willReturn( [ get_post( self::$story_id ) ] );
	}

	/**
	 * @covers ::setup
	 */
	public function test_setup_hooks_added() {

		$this->stories->method( 'get_story_attributes' )->willReturn(
			[
				'class'                     => '',
				'show_story_poster'         => false,
				'show_stories_archive_link' => true,
				'stories_archive_label'     => 'Visual Stories',
				'list_view_image_alignment' => 'left',
			]
		);

		$renderer = new \Google\Web_Stories\Stories_Renderer\Generic_Renderer( $this->stories );
		$renderer->setup();

		$this->assertSame( 10, has_action( 'web_stories_renderer_container_start', [ $renderer, 'amp_carousel' ] ) );
		$this->assertSame( 10, has_action( 'web_stories_renderer_container_end', [ $renderer, 'amp_carousel' ] ) );
		$this->assertSame( 10, has_action( 'web_stories_renderer_content', [ $renderer, 'render_story' ] ) );
		$this->assertSame( 10, has_action( 'web_stories_renderer_wrapper_end', [ $renderer, 'maybe_render_archive_link' ] ) );
		$this->assertSame( 10, has_action( 'web_stories_renderer_story_content_overlay', [ $renderer, 'get_content_overlay' ] ) );
		$this->assertSame( 10, has_action( 'web_stories_renderer_single_story_content', [ $renderer, 'render_story_with_poster' ] ) );
		$this->assertSame( 10, has_action( 'web_stories_renderer_single_story_content', [ $renderer, 'render_story_with_story_player' ] ) );
		$this->assertSame( 10, has_action( 'web_stories_renderer_container_classes', [ $renderer, 'container_classes' ] ) );
		$this->assertSame( 10, has_action( 'web_stories_renderer_container_style', [ $renderer, 'container_styles' ] ) );
		$this->assertSame( 10, has_action( 'web_stories_renderer_single_story_classes', [ $renderer, 'single_story_classes' ] ) );
	}

	/**
	 * @covers ::assets
	 */
	public function test_assets() {
		$this->stories->method( 'get_story_attributes' )->willReturn(
			[
				'class'                     => '',
				'view_type'                 => 'list',
				'show_story_poster'         => true,
				'list_view_image_alignment' => 'left',
			]
		);

		$renderer = new \Google\Web_Stories\Stories_Renderer\Generic_Renderer( $this->stories );
		$renderer->setup();

		$this->assertTrue( wp_style_is( \Google\Web_Stories\Stories_Renderer\Renderer::STYLE_HANDLE ) );
	}

	/**
	 * @covers ::assets
	 */
	public function test_assets_story_player() {
		$this->stories->method( 'get_story_attributes' )->willReturn(
			[
				'class'             => '',
				'view_type'         => 'carousel',
				'show_story_poster' => false,
			]
		);

		$renderer = new \Google\Web_Stories\Stories_Renderer\Generic_Renderer( $this->stories );
		$renderer->setup();

		$this->assertTrue( wp_style_is( \Google\Web_Stories\Embed_Base::STORY_PLAYER_HANDLE ) );
	}

	/**
	 * @covers ::maybe_render_archive_link
	 */
	public function test_maybe_render_archive_link() {

		$this->stories->method( 'get_story_attributes' )->willReturn(
			[
				'class'                     => '',
				'show_story_poster'         => false,
				'show_stories_archive_link' => true,
				'stories_archive_label'     => 'View All Stories',
			]
		);

		$renderer = new \Google\Web_Stories\Stories_Renderer\Generic_Renderer( $this->stories );

		$archive_link = get_post_type_archive_link( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		ob_start();
		$renderer->maybe_render_archive_link();
		$expected = ob_get_clean();
		$this->assertContains( 'web-stories__archive-link', $expected );
		$this->assertContains( $archive_link, $expected );
		$this->assertContains( 'View All Stories', $expected );

	}

	/**
	 * @covers ::container_classes
	 */
	public function test_container_classes() {

		$this->stories->method( 'get_story_attributes' )->willReturn(
			[
				'view_type'         => 'circles',
				'class'             => '',
				'show_story_poster' => false,
			]
		);

		$renderer = new \Google\Web_Stories\Stories_Renderer\Generic_Renderer( $this->stories );

		$expected = trim( 'test  is-view-type-circles alignnone' );
		$output   = $renderer->container_classes( 'test' );

		$this->assertEquals( $expected, $output );
	}

	/**
	 * @covers ::single_story_classes
	 */
	public function test_single_story_classes() {
		$this->stories->method( 'get_story_attributes' )->willReturn(
			[
				'show_story_poster' => true,
			]
		);

		$renderer = new \Google\Web_Stories\Stories_Renderer\Generic_Renderer( $this->stories );
		$expected = 'test web-stories__story-wrapper has-poster';

		$output = $renderer->single_story_classes( 'test' );

		$this->assertEquals( $expected, $output );
	}

	/**
	 * @covers ::container_styles
	 */
	public function test_container_styles() {
		$this->stories->method( 'get_story_attributes' )->willReturn(
			[
				'view_type'         => 'grid',
				'number_of_columns' => '3',
				'class'             => '',
			]
		);

		$renderer = new \Google\Web_Stories\Stories_Renderer\Generic_Renderer( $this->stories );

		$expected = 'grid-template-columns:repeat(3, 1fr);';
		$output   = $renderer->container_styles( '' );

		$this->assertEquals( $expected, $output );
	}

	/**
	 * @covers ::amp_carousel
	 */
	public function test_amp_carousel_container_start() {
		global $wp_current_filter;

		$this->stories->method( 'get_story_attributes' )->willReturn(
			[
				'view_type'         => 'carousel',
				'class'             => '',
				'show_story_poster' => false,
			]
		);

		$renderer = new \Google\Web_Stories\Stories_Renderer\Generic_Renderer( $this->stories );

		$wp_current_filter = [ 'web_stories_renderer_container_start' ];

		ob_start();
		$renderer->amp_carousel();
		$output = ob_get_clean();

		$this->assertContains( '<amp-carousel', $output );

	}

	/**
	 * @covers ::amp_carousel
	 */
	public function test_amp_carousel_container_end() {
		global $wp_current_filter;

		$this->stories->method( 'get_story_attributes' )->willReturn(
			[
				'view_type'         => 'carousel',
				'class'             => '',
				'show_story_poster' => false,
			]
		);

		$renderer = new \Google\Web_Stories\Stories_Renderer\Generic_Renderer( $this->stories );

		$wp_current_filter = [ 'web_stories_renderer_container_end' ];

		ob_start();
		$renderer->amp_carousel();
		$output = ob_get_clean();

		$this->assertContains( '</amp-carousel>', $output );
	}

	/**
	 * @covers ::render_story_with_story_player
	 */
	public function test_render_story_with_story_player() {

		$this->stories->method( 'get_story_attributes' )->willReturn(
			[
				'view_type'         => 'grid',
				'class'             => '',
				'show_story_poster' => false,
			]
		);

		$renderer = new \Google\Web_Stories\Stories_Renderer\Generic_Renderer( $this->stories );

		$story_data = [
			'url'    => 'www.example.com',
			'title'  => 'Story Title',
			'poster' => 'www.example.com/image.jpg',
			'height' => '430',
			'width'  => '285',
		];


		ob_start();
		$renderer->render_story_with_story_player( $story_data );
		$output = ob_get_clean();

		$this->assertContains( '<amp-story-player  style="width: 285px;height: 430px">', $output );
		$this->assertContains( '--story-player-poster: url(www.example.com/image.jpg)', $output );
		$this->assertContains( 'Story Title', $output );
	}

	/**
	 * @covers ::render_story_with_poster
	 */
	public function test_render_story_with_poster() {

		$this->stories->method( 'get_story_attributes' )->willReturn(
			[
				'view_type'                 => 'list',
				'class'                     => '',
				'show_story_poster'         => true,
				'list_view_image_alignment' => 'left',
			]
		);

		$renderer = new \Google\Web_Stories\Stories_Renderer\Generic_Renderer( $this->stories );

		$story_data = [
			'url'    => 'www.example.com',
			'title'  => 'Story Title',
			'poster' => 'www.example.com/image.jpg',
			'height' => '430',
			'width'  => '285',
		];


		ob_start();
		$renderer->render_story_with_poster( $story_data );
		$output = ob_get_clean();

		$this->assertContains( 'web-stories__story-placeholder', $output );
		$this->assertContains( 'style="background-image: url(http://www.example.com/image.jpg);"', $output );
	}

	/**
	 * @covers ::render_story
	 */
	public function test_render_story() {
		add_filter( 'web_stories_renderer_single_story_classes', [ $this, 'add_single_story_class' ] );

		$renderer = new \Google\Web_Stories\Stories_Renderer\Generic_Renderer( $this->stories );

		ob_start();
		$renderer->render_story( [] );
		$output = ob_get_clean();

		$this->assertEmpty( $output );

		$story_data = [
			'url'    => 'www.example.com',
			'title'  => 'Story Title',
			'poster' => 'www.example.com/image.jpg',
			'height' => '430',
			'width'  => '285',
		];

		ob_start();
		$renderer->render_story( $story_data );
		$output = ob_get_clean();

		$this->assertContains( 'test-single-class', $output );
		remove_filter( 'web_stories_renderer_single_story_classes', [ $this, 'add_single_story_class' ] );
	}

	/**
	 * @covers ::render
	 */
	public function test_render() {

		add_filter( 'web_stories_renderer_container_classes', [ $this, 'add_stories_container_class' ] );
		add_filter( 'web_stories_renderer_container_style', [ $this, 'add_stories_container_style' ] );

		$this->stories->method( 'get_story_attributes' )->willReturn(
			[
				'view_type'                 => 'circles',
				'number_of_columns'         => 2,
				'show_title'                => false,
				'show_author'               => false,
				'show_date'                 => false,
				'show_story_poster'         => true,
				'show_stories_archive_link' => false,
				'stories_archive_label'     => 'View all stories',
				'list_view_image_alignment' => 'left',
				'class'                     => '',
			]
		);

		$renderer = new \Google\Web_Stories\Stories_Renderer\Generic_Renderer( $this->stories );

		$output = $renderer->render();

		$this->assertContains( 'test-container-class', $output );
		$this->assertContains( 'background: red;', $output );

		remove_filter( 'web_stories_renderer_container_classes', [ $this, 'add_stories_container_class' ] );
		remove_filter( 'web_stories_renderer_container_style', [ $this, 'add_stories_container_style' ] );

	}

	/**
	 * @covers ::get_content_overlay
	 */
	public function test_get_content_overlay() {

		$renderer = new \Google\Web_Stories\Stories_Renderer\Generic_Renderer( $this->stories );

		ob_start();
		$renderer->get_content_overlay( [] );
		$output = ob_get_clean();

		$this->assertEmpty( $output );

		ob_start();
		$renderer->get_content_overlay( [] );
		$output = ob_get_clean();

		$story_data = [
			'title'                => 'Story Title',
			'date'                 => 'November 11, 2020',
			'author'               => 'admin',
			'show_content_overlay' => true,
		];

		ob_start();
		$renderer->get_content_overlay( $story_data );
		$output = ob_get_clean();

		$this->assertContains( 'By admin', $output );
		$this->assertContains( 'On November 11, 2020', $output );
		$this->assertContains( 'Story Title', $output );
	}

	public function add_stories_container_class() {
		return 'test-container-class';
	}

	public function add_stories_container_style() {
		return 'background: red;';
	}

	public function add_single_story_class() {
		return 'test-single-class';
	}

}
