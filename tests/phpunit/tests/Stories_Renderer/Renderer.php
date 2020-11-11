<?php
/**
 * Generic_Renderer class.
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

namespace Google\Web_Stories\Tests\Stories_Renderer;

use Google\Web_Stories\Tests\Test_Renderer;
use Google\Web_Stories\Stories;
use Google\Web_Stories\Tests\Private_Access;

/**
 * Generic_Renderer class.
 */
class Renderer extends \WP_UnitTestCase_Base {

	use Private_Access;

	/**
	 * Story post ID.
	 *
	 * @var int
	 */
	private static $story_id;

	/**
	 * Stories mock object.
	 *
	 * @var Stories_Mock
	 */
	private $stories;

	/**
	 * Runs once before any test in the class run.
	 *
	 * @param WP_UnitTest_Factory $factory Factory class object.
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		self::$story_id = $factory->post->create(
			[
				'post_type' => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
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
	 * @covers ::asset
	 */
	public function test_asset() {
		$renderer = new Test_Renderer( $this->stories );

		$renderer->assets();

		$this->assertTrue( wp_style_is( \Google\Web_Stories\Stories_Renderer\Renderer::STYLE_HANDLE ) );
	}

	/**
	 * @covers ::is_view_type
	 */
	public function test_is_view_type() {

		$this->stories->method( 'get_story_attributes' )->willReturn(
			[
				'view_type' => 'grid',
			]
		);
		$renderer = new Test_Renderer( $this->stories );

		$output = $this->call_private_method( $renderer, 'is_view_type', [ 'grid' ] );

		$this->assertTrue( $output );

		$output = $this->call_private_method( $renderer, 'is_view_type', [ 'list' ] );

		$this->assertFalse( $output );
	}

	/**
	 * @covers ::is_view_type
	 */
	public function test_get_view_type() {

		$this->stories->method( 'get_story_attributes' )->willReturn(
			[
				'view_type' => 'grid',
			]
		);
		$renderer = new Test_Renderer( $this->stories );

		$output = $this->call_private_method( $renderer, 'get_view_type' );

		$this->assertEquals( 'grid', $output );

	}

	public function test_get_story_item_data() {

		$this->stories->method( 'get_story_attributes' )->willReturn(
			[
				'view_type'   => 'grid',
				'show_title'  => true,
				'show_author' => true,
				'show_date'   => true,
			]
		);
		$renderer = new Test_Renderer( $this->stories );

		$output = $this->call_private_method( $renderer, 'get_story_item_data', [ '' ] );

		$this->assertEmpty( $output );

		$output = $this->call_private_method( $renderer, 'get_story_item_data', [ self::$story_id, 'test' ] );

		$expected = $this->get_story_item_data( $renderer );

		$this->assertSame( $expected, $output );
	}

	/**
	 * Utility function to get story item data,
	 *
	 * @param Test_Renderer $renderer Test renderer.
	 *
	 * @return array
	 */
	public function get_story_item_data( $renderer ) {

		$attributes = $this->get_private_property( $renderer, 'attributes' );

		$author_id       = get_post_field( 'post_author', self::$story_id );
		$is_circles_view = $this->call_private_method( $renderer, 'is_view_type', [ 'list' ] );
		$image_size      = $is_circles_view ? \Google\Web_Stories\Media::POSTER_SQUARE_IMAGE_SIZE : \Google\Web_Stories\Media::POSTER_PORTRAIT_IMAGE_SIZE;
		$story_title     = ( ! empty( $attributes['show_title'] ) && ( true === $attributes['show_title'] ) ) ?
			get_the_title( self::$story_id ) :
			'';
		$author_name     = ( ! $is_circles_view && ! empty( $attributes['show_author'] ) && ( true === $attributes['show_author'] ) ) ?
			get_the_author_meta( 'display_name', $author_id ) :
			'';
		$story_date      = ( ! $is_circles_view && ! empty( $attributes['show_date'] ) && ( true === $attributes['show_date'] ) ) ?
			get_the_date( 'M j, Y', self::$story_id ) :
			'';

		$story_data['ID']                   = self::$story_id;
		$story_data['url']                  = get_post_permalink( self::$story_id );
		$story_data['title']                = $story_title;
		$story_data['height']               = '430';
		$story_data['width']                = '285';
		$story_data['poster']               = get_the_post_thumbnail_url( self::$story_id, $image_size );
		$story_data['author']               = $author_name;
		$story_data['date']                 = $story_date;
		$story_data['class']                = 'test';
		$story_data['show_content_overlay'] = ( ! empty( $story_title ) || ! empty( $author_name ) || ! empty( $story_date ) );

		return $story_data;
	}

}
