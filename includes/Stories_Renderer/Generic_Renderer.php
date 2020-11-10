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
use Google\Web_Stories\Stories;
use Google\Web_Stories\Story_Post_Type;

/**
 * Generic_Renderer class.
 */
class Generic_Renderer extends Renderer {

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
	 * Renders the stories output for given attributes.
	 *
	 * @return string Rendered stories output.
	 */
	public function render() {

		$container_classes  = 'web-stories ';
		$container_classes .= $this->attributes['class'];

		$single_story_classes = ( ! empty( $this->attributes['show_story_poster'] ) && true === $this->attributes['show_story_poster'] ) ?
			'web-stories__story-wrapper has-poster' :
			'web-stories__story-wrapper';

		$container_classes .= ( ! empty( $this->attributes['view_type'] ) ) ? " is-view-type-{$this->attributes['view_type']}" : ' is-view-type-grid';
		$container_classes .= ( ! empty( $this->attributes['align'] ) ) ? " align{$this->attributes['align']}" : ' alignnone';

		$container_style = ( true === $this->is_view_type( 'grid' ) ) ? "grid-template-columns:repeat({$this->attributes['number_of_columns']}, 1fr);" : '';

		$is_circles_view = $this->is_view_type( 'circles' );
		$is_list_view    = $this->is_view_type( 'list' );

		$story_posts = $this->stories->get_stories();

		if ( empty( $story_posts ) ) {
			return '';
		}

		// Enqueue amp runtime script and amp-carousel script to show amp-carousel on non AMP pages.
		if ( $this->is_view_type( 'carousel' ) && ! $this->is_amp_request() ) {
			wp_register_script( 'amp-runtime-script', 'https://cdn.ampproject.org/v0.js', [], 'v0', true );
			wp_register_script( 'amp-carousel-script', 'https://cdn.ampproject.org/v0/amp-carousel-0.2.js', [ 'amp-runtime-script' ], 'v0', true );
			wp_enqueue_script( 'amp-carousel-script' );
			wp_enqueue_script( 'amp-runtime-script' );
		}

		ob_start();
		?>

		<div>
			<div
				class="<?php echo( esc_attr( $container_classes ) ); ?>"
				style="<?php echo( esc_attr( $container_style ) ); ?>"
			>
				<?php
				if ( $this->is_view_type( 'carousel' ) ) :
					?>
					<amp-carousel
						width="1"
						height="1"
						layout="intrinsic"
						type="carousel"
						role="region"
						aria-label="Basic carousel"
						<?php
						if ( ! empty( $this->attributes['autoplay'] ) && ( true === $this->attributes['autoplay'] ) ) {
							echo( 'autoplay' );
						}
						?>
						<?php
						if ( ! empty( $this->attributes['loop'] ) && ( true === $this->attributes['loop'] ) ) {
							echo( 'loop' );
						}
						?>
						delay="<?php echo( ! empty( $this->attributes['delay'] ) ) ? ( absint( $this->attributes['delay'] ) * 1000 ) : ''; ?>"
					>
					<?php
				endif;

				foreach ( $story_posts as $story_post ) :

					$story_data = $this->get_story_item_data( $story_post->ID, $single_story_classes, $this->attributes );

					if ( ( $is_list_view || $is_circles_view ) || ( true === $this->attributes['show_story_poster'] ) ) :
						echo( $this->render_story_with_poster( $story_data, $single_story_classes ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					else :
						echo( $this->render_story_with_story_player( $story_data, $single_story_classes ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					endif;

				endforeach;

				if ( $this->is_view_type( 'carousel' ) ) :
					?>
					</amp-carousel>
					<?php
				endif;
				?>
			</div>
			<?php $this->maybe_render_archive_link(); ?>
		</div>
		<?php

		return (string) ob_get_clean();
	}

	/**
	 * Renders stories archive link if the 'show_view_all_link' attribute is set to true.
	 */
	protected function maybe_render_archive_link() {

		if ( ( ! empty( $this->attributes['show_view_all_link'] ) ) && ( true === $this->attributes['show_view_all_link'] ) ) :
			$web_stories_archive = get_post_type_archive_link( Story_Post_Type::POST_TYPE_SLUG );
			?>
			<div class="web-stories__archive-link">
				<a href="<?php echo( esc_url_raw( $web_stories_archive ) ); ?>">
					<?php echo( esc_html( $this->attributes['view_all_label'] ) ); ?>
				</a>
			</div>
			<?php
		endif;
	}

	/**
	 * Renders a story with story's poster image.
	 *
	 * @param array  $story_data           Story item data. Contains information like url, height, width, etc of the story.
	 * @param string $single_story_classes Single story's classes.
	 *
	 * @return string Returns the story ouput with poster.
	 */
	protected function render_story_with_poster( array $story_data, string $single_story_classes = '' ) {

		if ( empty( $story_data['url'] ) ) {
			return '';
		}

		$has_content_overlay  = false;
		$single_story_classes = ( ! empty( $single_story_classes ) && is_string( $single_story_classes ) ) ? $single_story_classes : '';

		if ( ! empty( $story_data['show_content_overlay'] ) && ( true === $story_data['show_content_overlay'] ) ) {
			$has_content_overlay = true;
		}

		$height = ! empty( $story_data['height'] ) ? absint( $story_data['height'] ) : 600;
		$width  = ! empty( $story_data['width'] ) ? absint( $story_data['width'] ) : 360;

		$poster_style = sprintf( 'background-image: url(%1$s);', esc_url_raw( $poster ) );

		if ( true === $this->is_view_type( 'carousel' ) ) {
			$poster_style = sprintf( '%1$s width: %2$spx; height: %3$spx', $poster_style, $width, $height );
		}

		ob_start();
		?>

		<div class="<?php echo( esc_attr( $single_story_classes ) ); ?>">
			<a class="<?php echo( esc_attr( "image-align-{$this->attributes['list_view_image_alignment']}" ) ); ?>"
				href="<?php echo( esc_url_raw( $story_data['url'] ) ); ?>"
			>
				<div
					class="web-stories__story-placeholder"
					style="<?php echo esc_attr( $poster_style ); ?>"
				></div>
				<?php
				if ( true === $has_content_overlay ) :
					$this->get_content_overlay( $story_data );
				endif;
				?>
			</a>
		</div>

		<?php

		return (string) ob_get_clean();
	}

	/**
	 * Renders a story with amp-story-player.
	 *
	 * @param array  $story_data          Story attributes. Contains information like url, height, width, etc of the story.
	 * @param string $single_story_classes Single story's classes.
	 *
	 * @return string Returns the story ouput with amp-story-player.
	 */
	protected function render_story_with_story_player( array $story_data, string $single_story_classes = '' ) {

		$height = ! empty( $story_data['height'] ) ? absint( $story_data['height'] ) : 600;
		$width  = ! empty( $story_data['width'] ) ? absint( $story_data['width'] ) : 360;

		$player_style = sprintf( 'width: %1$spx;height: %2$spx', $width, $height );

		// Enqueue standalone amp story player scripts for non AMP pages.
		if ( true === $this->is_amp_request() ) {
			$story_player_attributes = sprintf( 'height=%d width=%d', $height, $width );
		} else {
			$story_player_attributes = '';
			wp_enqueue_style( Embed_Base::STORY_PLAYER_HANDLE );
			wp_enqueue_script( Embed_Base::STORY_PLAYER_HANDLE );
		}

		$poster_style = ! empty( $story_data['poster'] ) ? sprintf( '--story-player-poster: url(%s)', $story_data['poster'] ) : '';

		$has_content_overlay = false;

		if ( ! empty( $story_data['show_content_overlay'] ) && ( true === $story_data['show_content_overlay'] ) ) {
			$has_content_overlay = true;
		}

		ob_start();

		?>
		<div class="<?php echo( esc_attr( $single_story_classes ) ); ?>">
			<amp-story-player <?php echo( esc_attr( $story_player_attributes ) ); ?> style="<?php echo esc_attr( $player_style ); ?>">
				<a href="<?php echo esc_url( $story_data['url'] ); ?>" style="<?php echo esc_attr( $poster_style ); ?>"><?php echo esc_html( $story_data['title'] ); ?></a>
			</amp-story-player>

			<?php
			if ( true === $has_content_overlay ) :
				$this->get_content_overlay( $story_data );
				endif;
			?>
		</div>
		<?php

		return (string) ob_get_clean();
	}

	/**
	 * Renders the content overlay markup.
	 *
	 * @param array $story_data Story item data. Contains information like url, height, width, etc of the story.
	 */
	protected function get_content_overlay( array $story_data ) {
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
