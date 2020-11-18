<?php
/**
 * Locale class.
 *
 * Locale-related functionality.
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

namespace Google\Web_Stories;

/**
 * Locale class.
 */
class Latest_Stories {

	/**
	 * Initializes the latest stories features.
	 *
	 * @since
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'wp_body_open', [ $this, 'print_stories' ] );
	}

	/**
	 * Renders the block type output for given attributes.
	 *
	 * @param array   $attributes An array of story attributes.
	 * @param boolean $echo       Whether to echo the stories markup or not.
	 *
	 * @return string Rendered stories output.
	 */
	public function get_stories( array $attributes = [], $echo = 'false' ) {

		$default_attributes = [
			'view_type'                 => 'circles',
			'number_of_stories'         => 5,
			'number_of_columns'         => 2,
			'show_title'                => false,
			'show_author'               => false,
			'show_date'                 => false,
			'show_story_poster'         => true,
			'show_view_all_link'        => false,
			'view_all_label'            => 'View all stories',
			'order'                     => 'latest',
			'list_view_image_alignment' => 'left',
			'autoplay_carousel'         => false,
			'loop_carousel'             => false,
			'delay'                     => 5,
			'container_class'           => '',
		];

		$attributes = wp_parse_args( $attributes, $default_attributes );

		$content = '';

		$container_classes    = $attributes['container_class'];
		$container_classes   .= ' wp-block-web-stories-latest-stories latest-stories';
		$single_story_classes = ( ! empty( $attributes['show_story_poster'] ) && true === $attributes['show_story_poster'] ) ?
			'latest-stories__story-wrapper has-poster alignnone' :
			'latest-stories__story-wrapper';
		$container_style      = '';

		$container_classes .= ( ! empty( $attributes['view_type'] ) ) ? " is-view-type-{$attributes['view_type']}" : ' is-view-type-grid';
		$container_classes .= ( ! empty( $attributes['align'] ) ) ? " align{$attributes['align']}" : ' alignnone';

		if ( ! empty( $attributes['view_type'] && 'grid' === $attributes['view_type'] ) ) {
			$container_style .= "grid-template-columns:repeat({$attributes['number_of_columns']}, 1fr);";
		}

		$query_args    = $this->get_query_args( $attributes );
		$stories_query = new \WP_Query( $query_args );

		$is_circles_view = ( ! empty( $attributes['view_type'] ) && ( 'circles' === $attributes['view_type'] ) ) ? true : false; // @TODO: Create a function to check view type.
		$is_list_view    = ( ! empty( $attributes['view_type'] ) && ( 'list' === $attributes['view_type'] ) ) ? true : false; // @TODO: Create a function to check view type.

		if ( $stories_query->have_posts() ) :

			ob_start();
			?>
			<div>
				<div
					class="<?php echo( esc_attr( $container_classes ) ); ?>"
					style="<?php echo( esc_attr( $container_style ) ); ?>"
				>
					<?php
					if ( ! empty( $attributes['view_type'] && 'carousel' === $attributes['view_type'] ) ) :
						?>
						<amp-carousel
							width="400"
							height="280"
							layout="responsive"
							type="slides"
							role="region"
							aria-label="Basic carousel"
							<?php
							if ( ! empty( $attributes['autoplay_carousel'] ) && ( true === $attributes['autoplay_carousel'] ) ) {
								echo( 'autoplay' );
							}
							?>
							<?php
							if ( ! empty( $attributes['loop_carousel'] ) && ( true === $attributes['loop_carousel'] ) ) {
								echo( 'loop' );
							}
							?>
							delay="<?php echo( ! empty( $attributes['delay'] ) ) ? ( absint( $attributes['delay'] ) * 1000 ) : ''; ?>"
						>
						<?php
					endif;
					while ( $stories_query->have_posts() ) :
						$stories_query->the_post();

						$current_post_id = get_the_ID();
						$story_attrs     = $this->get_story_attrs( $current_post_id, $single_story_classes, $attributes );

						if ( ( $is_list_view || $is_circles_view ) || ( ! empty( $attributes['show_story_poster'] && true === $attributes['show_story_poster'] ) ) ) :
							echo( $this->render_story_with_poster( $story_attrs, $single_story_classes, $attributes ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
							endif;

						endwhile;

					if ( ! empty( $attributes['view_type'] && 'carousel' === $attributes['view_type'] ) ) :
						?>
						</amp-carousel>
						<?php
					endif;
					?>
				</div>
				<?php $this->maybe_render_archive_link( $attributes ); ?>
			</div>
			<?php

			$content = (string) ob_get_clean();
		endif;

		wp_reset_postdata();

		if ( false === $echo ) {
			return $content;
		}

		echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

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
			return [];
		}

		$query_args = [
			'post_type'        => Story_Post_Type::POST_TYPE_SLUG,
			'posts_per_page'   => 10,
			'post_status'      => 'publish',
			'suppress_filters' => false,
			'no_found_rows'    => true,
			'fields'           => 'ids',
		];

		$order_by_value = ( ! empty( $attributes['order'] ) ) ? $attributes['order'] : '';
		$num_of_stories = ( ! empty( $attributes['number_of_stories'] ) ) ? absint( $attributes['number_of_stories'] ) : '';

		if ( ! empty( $num_of_stories ) ) {
			$query_args['posts_per_page'] = $num_of_stories;
		}

		if ( ! empty( $order_by_value ) ) {
			switch ( $order_by_value ) {
				case 'oldest':
					$query_args['order'] = 'ASC';
					break;
				case 'asc':
					$query_args['orderby'] = 'title';
					$query_args['order']   = 'ASC';
					break;
				case 'desc':
					$query_args['orderby'] = 'title';
					$query_args['order']   = 'DESC';
					break;
			}
		}

		if ( ! empty( $attributes['authors'] ) && is_array( $attributes['authors'] ) ) {
			$author_ids = wp_list_pluck( $attributes['authors'], 'id' );

			if ( ! empty( $author_ids ) && is_array( $author_ids ) ) {
				$query_args['author__in'] = $author_ids;
			}
		}

		return $query_args;
	}

	/**
	 * Renders stories archive link conditionally dependeing on the block attributes.
	 *
	 * @since
	 *
	 * @param array $attributes Current block's attributes. If not passed, will use attributes stored in class variable.
	 *
	 * @return void
	 */
	protected function maybe_render_archive_link( array $attributes = [] ) {

		if ( empty( $attributes ) ) {
			return;
		}

		if ( ( ! empty( $attributes['show_view_all_link'] ) ) && ( true === $attributes['show_view_all_link'] ) ) :
			$web_stories_archive = get_post_type_archive_link( Story_Post_Type::POST_TYPE_SLUG );

			?>

			<div class="latest-stories__archive-link">
				<a href="<?php echo( esc_url_raw( $web_stories_archive ) ); ?>">
					<?php echo( esc_html( $attributes['view_all_label'] ) ); ?>
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
	 * @param array  $attributes           An array of story attributes.
	 *
	 * @return string
	 */
	protected function render_story_with_poster( $story_attrs, $single_story_classes = '', $attributes ) {

		if ( empty( $story_attrs['url'] ) ) {
			return '';
		}

		$has_content_overlay = false;

		if ( ! empty( $story_attrs['show_content_overlay'] ) && ( true === $story_attrs['show_content_overlay'] ) ) {
			$has_content_overlay = true;
		}

		if ( ! empty( $story_attrs['poster'] ) ) {
			$poster = $story_attrs['poster'];
		} else {
			$poster = $this->get_fallback_story_poster();
		}

		ob_start();
		?>

		<div class="<?php echo( esc_attr( $single_story_classes ) ); ?>">
			<a class="<?php echo( esc_attr( "image-align-{$attributes['list_view_image_alignment']}" ) ); ?>"
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

	/**
	 * Returns story attributes based on block attributes.
	 *
	 * @since
	 *
	 * @param array  $story_id             Story's id for which the story attributes are requested.
	 * @param string $single_story_classes Single story's classes.
	 * @param array  $attributes An array of story attributes.
	 *
	 * @return array
	 */
	protected function get_story_attrs( $story_id, $single_story_classes = '', $attributes ) {

		$story_attrs = [];

		if ( empty( $story_id ) ) {
			return $story_attrs;
		}

		$is_circles_view = ( ! empty( $attributes['view_type'] ) && ( 'circles' === $attributes['view_type'] ) ) ? true : false; // @TODO: Create a function to check view type.
		$image_size      = $is_circles_view ? Media::POSTER_SQUARE_IMAGE_SIZE : Media::POSTER_PORTRAIT_IMAGE_SIZE;
		$story_title     = ( ! $is_circles_view && ! empty( $attributes['show_title'] ) && ( true === $attributes['show_title'] ) ) ?
			get_the_title( $story_id ) :
			'';
		$author_name     = ( ! $is_circles_view && ! empty( $attributes['show_author'] ) && ( true === $attributes['show_author'] ) ) ?
			get_the_author_meta( 'display_name' ) :
			'';
		$story_date      = ( ! $is_circles_view && ! empty( $attributes['show_date'] ) && ( true === $attributes['show_date'] ) ) ?
			get_the_date( 'M j, Y' ) :
			'';

		$story_attrs['url']                  = get_post_permalink( $story_id );
		$story_attrs['title']                = $story_title;
		$story_attrs['height']               = '430';
		$story_attrs['poster']               = get_the_post_thumbnail_url( $story_id, $image_size );
		$story_attrs['author']               = $author_name;
		$story_attrs['date']                 = $story_date;
		$story_attrs['class']                = $single_story_classes;
		$story_attrs['show_content_overlay'] = ( ! empty( $story_title ) || ! empty( $author_name ) || ! empty( $story_date ) ) ? true : false;

		return $story_attrs;
	}

	/**
	 * Returns 'post_content_filtered' field for current post or for the post of given id.
	 *
	 * @since
	 *
	 * @param int $post_id Post id of the post for which the field value is required. If not passed, will
	 *                     try and get current post in the loop.
	 *
	 * @return object 'post_content_filtered' field's value.
	 */
	protected function get_post_content_filtered( $post_id = null ) {

		$post_content_filtered = new \stdClass();
		$post_obj              = get_post( $post_id );

		if ( empty( $post_obj ) || ! is_a( $post_obj, 'WP_Post' ) ) {
			return $post_content_filtered;
		}

		$post_id = $post_obj->ID;

		if ( empty( $post_id ) && empty( get_the_ID() ) ) {
			return $post_content_filtered;
		}

		$post_content_filtered = json_decode( get_post_field( 'post_content_filtered', $post_id ) );

		return $post_content_filtered;

	}

	/**
	 * Returns image source url of the poster for current post. If poster isn't present, will fallback to first image on first page of the story.
	 *
	 * @since
	 *
	 * @return string image source url.
	 */
	protected function get_fallback_story_poster() {
		$thumbnail_url         = '';
		$post_content_filtered = $this->get_post_content_filtered();

		if ( empty( $post_content_filtered->pages ) ) {
			return $thumbnail_url;
		}

		$first_page = $post_content_filtered->pages[0];

		if ( empty( $first_page->elements ) || ! is_array( $first_page->elements ) ) {
			return $thumbnail_url;
		}

		foreach ( $first_page->elements as $element ) {
			if ( 'image' === $element->type && 'image' === $element->resource->type ) {
				$thumbnail_url = $element->resource->src;
				break;
			}
		}

		return $thumbnail_url;
	}

	/**
	 * Prints latest web stories.
	 *
	 * @return void
	 */
	public function print_stories() {
		$options = get_option( 'story-options' );

		$theme_support = get_theme_support( 'web-story-options' );

		$default_array = [
			'view_type'         => ( ! empty( $theme_support[0]['view-type-default'] ) ) ? $theme_support[0]['view-type-default'] : 'circles',
			'section_title'     => ( ! empty( $theme_support[0]['section-title-default'] ) ) ? $theme_support[0]['section-title-default'] : 'Visual Stories',
			'show_title'        => ( ! empty( $theme_support[0]['title-default'] ) ) ? $theme_support[0]['title-default'] : false,
			'show_author'       => ( ! empty( $theme_support[0]['author-default'] ) ) ? $theme_support[0]['author-default'] : false,
			'show_date'         => ( ! empty( $theme_support[0]['date-default'] ) ) ? $theme_support[0]['date-default'] : false,
			'view_all_label'    => ( ! empty( $theme_support[0]['view-all-label'] ) ) ? $theme_support[0]['view-all-label'] : 'View all stories',
			'number_of_stories' => ( ! empty( $theme_support[0]['number-of-stories'] ) && is_numeric( $theme_support[0]['number-of-stories'] ) ) ? $theme_support[0]['number-of-stories'] : 5,
			'order'             => ( ! empty( $theme_support[0]['order-default'] ) ) ? $theme_support[0]['order-default'] : 'latest',
			'show_story_poster' => ( ! empty( $theme_support[0]['show-story-poster-default'] ) ) ? $theme_support[0]['show-story-poster-default'] : true,
			'number_of_columns' => ( ! empty( $theme_support[0]['grid-columns-default'] ) && is_numeric( $theme_support[0]['grid-columns-default'] ) ) ? $theme_support[0]['grid-columns-default'] : 2,
			'delay'             => ( ! empty( $theme_support[0]['delay'] ) && is_numeric( $theme_support[0]['delay'] ) ) ? $theme_support[0]['delay'] : 5,
		];

		$attributes = wp_parse_args( $options, $default_array );

		$attributes['container_class'] = 'web-stories-customizer-stories';

		if ( empty( $attributes['show_stories'] ) || false === $attributes['show_stories'] ) {
			return;
		}

		$this->get_stories( $attributes, true );
	}
}
