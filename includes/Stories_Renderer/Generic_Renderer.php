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

namespace Google\Web_Stories\Stories_Renderer;

use Google\Web_Stories\Embed_Base;
use Google\Web_Stories\Story_Post_Type;

/**
 * Generic_Renderer class.
 */
class Generic_Renderer extends Renderer {
	/**
	 * Perform initial setup for object.
	 *
	 * @return void
	 */
	public function init() {
		parent::init();

		$this->assets();
	}

	/**
	 * Enqueue assets.
	 *
	 * @return void
	 */
	public function assets() {
		parent::assets();
		// Enqueue amp runtime script and amp-carousel script to show amp-carousel on non AMP pages.
		if ( $this->is_view_type( 'carousel' ) && ! $this->is_amp_request() ) {
			wp_register_script( 'amp-runtime-script', 'https://cdn.ampproject.org/v0.js', [], 'v0', true );
			wp_register_script( 'amp-carousel-script', 'https://cdn.ampproject.org/v0/amp-carousel-0.2.js', [ 'amp-runtime-script' ], 'v0', true );
			wp_enqueue_script( 'amp-carousel-script' );
		}

		if ( 'grid' === $this->get_view_type() && ! $this->is_amp_request() && true !== $this->attributes['show_story_poster'] ) {
			wp_enqueue_style( Embed_Base::STORY_PLAYER_HANDLE );
			wp_enqueue_script( Embed_Base::STORY_PLAYER_HANDLE );
		}
	}

	/**
	 * Renders the stories output for given attributes.
	 *
	 * @return string Rendered stories output.
	 */
	public function render() {
		if ( empty( $this->story_posts ) || ! is_array( $this->story_posts ) ) {
			return '';
		}

		$container_classes = $this->get_container_classes();
		$container_style   = $this->get_container_styles();

		ob_start();
		?>
		<div>
			<div
				class="<?php echo esc_attr( $container_classes ); ?>"
				style="<?php echo esc_attr( $container_style ); ?>"
			>
				<?php
				foreach ( $this->story_posts as $story_post ) {
					$this->render_single_story_content( $story_post->ID );
				}
				?>

			</div>
			<?php $this->maybe_render_archive_link(); ?>
		</div>
		<?php

		/**
		 * Filters the Generic renderer stories content.
		 *
		 * @param string $content Stories content.
		 */
		return apply_filters( 'web_stories_generic_renderer_stories_content', (string) ob_get_clean() );
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
