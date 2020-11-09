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

use Google\Web_Stories\Story_Post_Type;

/**
 * Generic_Renderer class.
 */
class Generic_Renderer extends Renderer {


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
	 * Class constructor
	 *
	 * @param Stories $stories An array of attributes.
	 */
	public function __construct( $stories ) {
		$this->stories    = $stories;
		$this->attributes = $this->stories->get_story_attributes();
	}

	/**
	 * Renders the block type output for given attributes.
	 *
	 * @return string Rendered stories output.
	 */
	public function render() {

		$content = '';

		$container_classes    = $this->attributes['class'];
		$container_classes   .= ' latest-stories';
		$single_story_classes = ( ! empty( $this->attributes['show_story_poster'] ) && true === $this->attributes['show_story_poster'] ) ?
			'latest-stories__story-wrapper has-poster alignnone' :
			'latest-stories__story-wrapper';
		$container_style      = '';

		$container_classes .= ( ! empty( $this->attributes['view_type'] ) ) ? " is-view-type-{$this->attributes['view_type']}" : ' is-view-type-grid';
		$container_classes .= ( ! empty( $this->attributes['align'] ) ) ? " align{$this->attributes['align']}" : ' alignnone';

		if ( ! empty( $this->attributes['view_type'] && 'grid' === $this->attributes['view_type'] ) ) {
			$container_style .= "grid-template-columns:repeat({$this->attributes['number_of_columns']}, 1fr);";
		}

		$is_circles_view = $this->is_view_type( 'circles' );
		$is_list_view    = $this->is_view_type( 'list' );

		$story_posts = $this->stories->get_stories();

		if ( ! empty( $story_posts ) ) :

			ob_start();
			?>
			<div>
				<div
					class="<?php echo( esc_attr( $container_classes ) ); ?>"
					style="<?php echo( esc_attr( $container_style ) ); ?>"
				>
					<?php
					foreach ( $story_posts as $story_post ) :

						$story_attrs = $this->get_story_item_data( $story_post->ID, $single_story_classes, $this->attributes );

						// @todo Add code to show amp-story player in else condition.
						if ( ( $is_list_view || $is_circles_view ) || ( ! empty( $this->attributes['show_story_poster'] && true === $this->attributes['show_story_poster'] ) ) ) :
							echo( $this->render_story_with_poster( $story_attrs, $single_story_classes ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
							endif;

						endforeach;
					?>
				</div>
				<?php $this->maybe_render_archive_link(); ?>
			</div>
			<?php

			$content = (string) ob_get_clean();
		endif;

		wp_reset_postdata();

		return $content;

	}

	/**
	 * Renders stories archive link conditionally dependeing on the block attributes.
	 *
	 * @since
	 *
	 * @return void
	 */
	protected function maybe_render_archive_link() {

		if ( ( ! empty( $this->attributes['show_view_all_link'] ) ) && ( true === $this->attributes['show_view_all_link'] ) ) :
			$web_stories_archive = get_post_type_archive_link( Story_Post_Type::POST_TYPE_SLUG );

			?>

			<div class="latest-stories__archive-link">
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
	 * @since
	 *
	 * @param array  $story_attrs          Story attributes. Contains information like url, height, width, etc of the story.
	 * @param string $single_story_classes Single story's classes.
	 *
	 * @return string
	 */
	protected function render_story_with_poster( $story_attrs, $single_story_classes = '' ) {

		if ( empty( $story_attrs['url'] ) ) {
			return '';
		}

		$has_content_overlay  = false;
		$single_story_classes = ( ! empty( $single_story_classes ) && is_string( $single_story_classes ) ) ? $single_story_classes : '';

		if ( ! empty( $story_attrs['show_content_overlay'] ) && ( true === $story_attrs['show_content_overlay'] ) ) {
			$has_content_overlay = true;
		}

		if ( ! empty( $story_attrs['poster'] ) ) {
			$poster = $story_attrs['poster'];
		} else {
			$poster = $this->get_fallback_story_poster( $story_attrs['ID'] );
		}

		ob_start();
		?>

		<div class="<?php echo( esc_attr( $single_story_classes ) ); ?>">
			<a class="<?php echo( esc_attr( "image-align-{$this->attributes['list_view_image_alignment']}" ) ); ?>"
				href="<?php echo( esc_url_raw( $story_attrs['url'] ) ); ?>"
			>
				<div
					class="latest-stories__story-placeholder"
					style="background-image: url(<?php echo( esc_url_raw( $poster ) ); ?>)"
				></div>
				<?php
				if ( true === $has_content_overlay ) :
					?>
					<div
						class="story-content-overlay latest-stories__story-content-overlay"
					>
						<?php if ( ! empty( $story_attrs['title'] ) ) : ?>
						<div class="story-content-overlay__title">
							<?php
							echo( esc_html( $story_attrs['title'] ) );
							?>
						</div>
						<?php endif; ?>
						<div class="story-content-overlay__author-date">
						<?php if ( ! empty( $story_attrs['author'] ) ) : ?>
							<div>
								<?php
								_e( 'By', 'web-stories' );
								echo( esc_html( ' ' . $story_attrs['author'] ) );
								?>
								</div>
							<?php endif; ?>
							<?php if ( ! empty( $story_attrs['date'] ) ) : ?>
							<time class="story-content-overlay__date">
								<?php
								_e( 'On', 'web-stories' );
								echo( esc_html( ' ' . $story_attrs['date'] ) );
								?>
							</time>
							<?php endif; ?>
						</div>
					</div>
					<?php
				endif;
				?>
			</a>
		</div>

		<?php

		return (string) ob_get_clean();
	}

}
