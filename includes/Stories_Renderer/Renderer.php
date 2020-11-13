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
use Google\Web_Stories\Story_Post_Type;

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
	 * Story posts.
	 *
	 * @var array An array of story posts.
	 */
	protected $story_posts = [];

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
	public function init() {
		$this->story_posts = $this->stories->get_stories();
	}

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

	/**
	 * Renders stories archive link if the 'show_stories_archive_link' attribute is set to true.
	 *
	 * @return void
	 */
	protected function maybe_render_archive_link() {
		if ( ( ! empty( $this->attributes['show_stories_archive_link'] ) ) && ( true === $this->attributes['show_stories_archive_link'] ) ) :
			$web_stories_archive = get_post_type_archive_link( Story_Post_Type::POST_TYPE_SLUG );
			$web_stories_archive = ( is_string( $web_stories_archive ) ? $web_stories_archive : '' );
			?>
			<div class="web-stories__archive-link">
				<a href="<?php echo( esc_url_raw( $web_stories_archive ) ); ?>">
					<?php echo( esc_html( $this->attributes['stories_archive_label'] ) ); ?>
				</a>
			</div>
			<?php
		endif;
	}

	/**
	 * Gets the classes for renderer container.
	 *
	 * @return string
	 */
	protected function get_container_classes() {
		$container_classes  = 'web-stories ';
		$container_classes .= ( ! empty( $this->attributes['view_type'] ) ) ? " is-view-type-{$this->attributes['view_type']}" : ' is-view-type-grid';
		$container_classes .= ( ! empty( $this->attributes['align'] ) ) ? " align{$this->attributes['align']}" : ' alignnone';

		$classes = ! empty( $this->attributes['classes'] ) ? $this->attributes['classes'] : '';

		return trim( $classes . ' ' . $container_classes );
	}

	/**
	 * Gets the single story container classes.
	 *
	 * @return string
	 */
	protected function get_single_story_classes() {
		$single_story_classes = ( ! empty( $this->attributes['show_story_poster'] ) && true === $this->attributes['show_story_poster'] ) ?
			'web-stories__story-wrapper has-poster' :
			'web-stories__story-wrapper';

		/**
		 * Filters the web stories renderer single story classes.
		 *
		 * @param string $class Single story classes.
		 */
		return apply_filters( 'web_stories_renderer_single_story_classes', $single_story_classes );
	}

	/**
	 * Gets the container style attributes.
	 *
	 * @return string
	 */
	protected function get_container_styles() {
		$container_style = ( true === $this->is_view_type( 'grid' ) ) ? "grid-template-columns:repeat({$this->attributes['number_of_columns']}, 1fr);" : '';

		/**
		 * Filters the web stories renderer container style.
		 *
		 * @param string $class Container style.
		 */
		return apply_filters( 'web_stories_renderer_container_style', $container_style );
	}

	/**
	 * Render story markup.
	 *
	 * @param int $story_id Story ID.
	 *
	 * @return void
	 */
	protected function render_single_story_content( $story_id ) {
		$story_data           = $this->get_story_item_data( $story_id );
		$single_story_classes = $this->get_single_story_classes();
		$show_story_player    = true !== $this->attributes['show_story_poster'] && 'grid' === $this->get_view_type();

		?>

		<div class="<?php echo esc_attr( $single_story_classes ); ?>">
			<?php
			if ( true === $show_story_player ) {
				$this->render_story_with_story_player( $story_data );
			} else {
				$this->render_story_with_poster( $story_data );
			}
			?>
		</div>
		<?php
	}

	/**
	 * Renders a story with story's poster image.
	 *
	 * @param array $story_data Story item data. Contains information like url, height, width, etc of the story.
	 *
	 * @return void
	 */
	protected function render_story_with_poster( array $story_data ) {
		$height       = ! empty( $story_data['height'] ) ? absint( $story_data['height'] ) : 600;
		$width        = ! empty( $story_data['width'] ) ? absint( $story_data['width'] ) : 360;
		$poster_style = sprintf( 'background-image: url(%1$s);', esc_url_raw( $story_data['poster'] ) );
		$poster_style = ( true === $this->is_view_type( 'carousel' ) ) ?
			sprintf( '%1$s width: %2$spx; height: %3$spx', $poster_style, $width, $height ) : $poster_style;

		?>
		<a class="<?php echo( esc_attr( "image-align-{$this->attributes['list_view_image_alignment']}" ) ); ?>"
			href="<?php echo( esc_url_raw( $story_data['url'] ) ); ?>"
		>
			<div
				class="web-stories__story-placeholder"
				style="<?php echo esc_attr( $poster_style ); ?>"
			></div>
			<?php $this->get_content_overlay( $story_data ); ?>
		</a>
		<?php
	}

	/**
	 * Renders a story with amp-story-player.
	 *
	 * @param array $story_data Story attributes. Contains information like url, height, width, etc of the story.
	 *
	 * @return void
	 */
	protected function render_story_with_story_player( array $story_data ) {
		$height                  = ! empty( $story_data['height'] ) ? absint( $story_data['height'] ) : 600;
		$width                   = ! empty( $story_data['width'] ) ? absint( $story_data['width'] ) : 360;
		$player_style            = sprintf( 'width: %1$spx;height: %2$spx', $width, $height );
		$story_player_attributes = $this->is_amp_request() ? sprintf( 'height=%d width=%d', $height, $width ) : '';
		$poster_style            = ! empty( $story_data['poster'] ) ? sprintf( '--story-player-poster: url(%s)', $story_data['poster'] ) : '';
		?>
		<amp-story-player <?php echo( esc_attr( $story_player_attributes ) ); ?> style="<?php echo esc_attr( $player_style ); ?>">
			<a href="<?php echo esc_url( $story_data['url'] ); ?>" style="<?php echo esc_attr( $poster_style ); ?>"><?php echo esc_html( $story_data['title'] ); ?></a>
		</amp-story-player>

		<?php
		$this->get_content_overlay( $story_data );
	}

	/**
	 * Renders the content overlay markup.
	 *
	 * @param array $story_data Story item data. Contains information like url, height, width, etc of the story.
	 *
	 * @return void
	 */
	protected function get_content_overlay( array $story_data ) {
		if ( empty( $story_data['show_content_overlay'] ) || ( true !== $story_data['show_content_overlay'] ) ) {
			return;
		}

		?>
		<div
			class="story-content-overlay web-stories__story-content-overlay"
		>
			<?php if ( ! empty( $story_data['title'] ) ) : ?>
			<div class="story-content-overlay__title">
				<?php
				echo( esc_html( $story_data['title'] ) );
				?>
			</div>
			<?php endif; ?>
			<div class="story-content-overlay__author-date">
				<?php if ( ! empty( $story_data['author'] ) ) : ?>
				<div>
					<?php
					esc_html_e( 'By', 'web-stories' );
					echo( esc_html( ' ' . $story_data['author'] ) );
					?>
					</div>
				<?php endif; ?>
				<?php if ( ! empty( $story_data['date'] ) ) : ?>
				<time class="story-content-overlay__date">
					<?php
					esc_html_e( 'On', 'web-stories' );
					echo( esc_html( ' ' . $story_data['date'] ) );
					?>
				</time>
				<?php endif; ?>
			</div>
		</div>
		<?php
	}
}
