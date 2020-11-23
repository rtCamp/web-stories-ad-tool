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
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Media;

/**
 * Latest Stories block class.
 */
class Latest_Stories_Block extends Embed_Base {
	/**
	 * Script handle.
	 *
	 * @var string
	 */
	const SCRIPT_HANDLE = 'latest-web-stories-block';

	/**
	 * Style handle.
	 *
	 * @var string
	 */
	const STYLE_HANDLE = 'latest-stories-block-style';

	/**
	 * Block name.
	 *
	 * @var string
	 */
	const BLOCK_NAME = 'web-stories/latest-stories';

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
		wp_register_script( 'amp-carousel-script', 'https://cdn.ampproject.org/v0/amp-carousel-0.1.js', [], 'v0', true );

		wp_register_style(
			self::STYLE_HANDLE,
			WEBSTORIES_PLUGIN_DIR_URL . 'includes/assets/latest-stories.css',
			[],
			'v0',
			false
		);

		wp_localize_script(
			self::SCRIPT_HANDLE,
			'webStoriesLatestBlockSettings',
			$this->get_script_settings()
		);

		// todo: use register_block_type_from_metadata() once generally available.
		register_block_type(
			self::BLOCK_NAME,
			[
				'attributes'      => [
					'align'                => [
						'type'    => 'string',
						'default' => 'none',
					],
					'viewType'             => [
						'type'    => 'string',
						'default' => 'grid',
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
					'carouselSettings'     => [
						'type'    => 'object',
						'default' => [
							'autoplay' => false,
							'delay'    => '',
							'loop'     => false,
						],
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
	 * @param array $attributes Block attributes.
	 *
	 * @return string Rendered block type output.*
	 */
	public function render_block( array $attributes ) {

		if ( false === $this->initialize_block_attributes( $attributes ) ) {
			return '';
		}

		$content              = '';
		$block_classes        = 'web-stories ';
		$block_classes        = ( ! empty( $attributes['isStyleSquared'] ) || ! empty( $attributes['isShowingStoryPlayer'] ) ) ? $block_classes . 'is-style-squared ' : $block_classes . 'is-style-default ';
		$single_story_classes = ( empty( $attributes['isShowingStoryPlayer'] ) ) ? 'web-stories__story-wrapper has-poster ' : 'web-stories__story-wrapper ';
		$block_style          = '';

		$block_classes  .= ( ! empty( $attributes['viewType'] ) ) ? " is-view-type-{$attributes['viewType']}" : ' is-view-type-grid';
		$alignment_class = ( ! empty( $attributes['align'] ) ) ? " align{$attributes['align']}" : ' alignnone';

		if ( $this->is_view_type( 'grid' ) ) {
			$num_of_columns = ( ! empty( $attributes['numOfColumns'] ) ) ? absint( $attributes['numOfColumns'] ) : 2;
			$block_classes .= " columns-{$num_of_columns}";
		}

		$query_args    = $this->get_query_args();
		$stories_query = new \WP_Query( $query_args );

		$is_grid_view = $this->is_view_type( 'grid' );

		if ( $stories_query->have_posts() ) :

			ob_start();
			?>
			<div class="<?php echo( esc_attr( $alignment_class ) ); ?>">
				<div
					class="<?php echo( esc_attr( $block_classes ) ); ?>"
					style="<?php echo( esc_attr( $block_style ) ); ?>"
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
							if ( ! empty( $attributes['carouselSettings']['autoplay'] ) && ( true === $attributes['carouselSettings']['autoplay'] ) ) {
								echo( 'autoplay' );
							}
							?>
							<?php
							if ( ! empty( $attributes['carouselSettings']['delay'] ) ) {
								$delay = absint( $attributes['carouselSettings']['delay'] ) * 1000;
								printf( "delay='%s'", esc_attr( $delay ) );
							}
							?>
						>
						<?php
					endif;

					while ( $stories_query->have_posts() ) :
						$stories_query->the_post();

						$current_post_id = get_the_ID();
						$story_attrs     = $this->get_story_attrs( $current_post_id, $single_story_classes );

						if ( ( ! $is_grid_view ) || ( empty( $attributes['isShowingStoryPlayer'] ) ) ) :
							if (
								( function_exists( 'amp_is_request' ) && ! amp_is_request() ) ||
								( function_exists( 'is_amp_endpoint' ) && ! is_amp_endpoint() )
							) {
								wp_enqueue_script( 'amp-runtime-script', 'https://cdn.ampproject.org/v0.js', [], 'v0', false );
								wp_enqueue_script( 'amp-story-player-script', 'https://cdn.ampproject.org/v0/amp-story-player-0.1.js', [], 'v0', false );
								wp_enqueue_script( 'amp-bind-script', 'https://cdn.ampproject.org/v0/amp-bind-0.1.js', [], 'v0', false );
								wp_enqueue_script( 'amp-carousel-script', 'https://cdn.ampproject.org/v0/amp-carousel-0.1.js', [], 'v0', false );
							}

							echo( $this->render_story_with_poster( $story_attrs, $single_story_classes, $attributes ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
						else :
							echo( $this->render( $story_attrs ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
						endif;
					endwhile;

					if ( $this->is_view_type( 'carousel' ) ) :
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

		return $content;
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
			$attributes = $this->block_attributes;
		}

		if ( empty( $attributes ) ) {
			return [];
		}

		$query_args     = [
			'post_type'        => Story_Post_Type::POST_TYPE_SLUG,
			'posts_per_page'   => 10,
			'post_status'      => 'publish',
			'suppress_filters' => false,
			'no_found_rows'    => true,
			'fields'           => 'ids',
		];
		$order_by_value = ( ! empty( $attributes['orderByValue'] ) ) ? $attributes['orderByValue'] : '';
		$num_of_stories = ( ! empty( $attributes['numOfStories'] ) ) ? absint( $attributes['numOfStories'] ) : '';

		if ( ! empty( $num_of_stories ) ) {
			$query_args['posts_per_page'] = $num_of_stories;
		}

		if ( ! empty( $order_by_value ) ) {
			switch ( $order_by_value ) {
				case 'old-to-new':
					$query_args['order'] = 'ASC';
					break;
				case 'alphabetical':
					$query_args['orderby'] = 'title';
					$query_args['order']   = 'ASC';
					break;
				case 'reverse-alphabetical':
					$query_args['orderby'] = 'title';
					$query_args['order']   = 'DESC';
					break;
				case 'random':
					$query_args['orderby'] = 'rand';
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
			$attributes = $this->block_attributes;
		}

		if ( empty( $attributes ) ) {
			return;
		}

		if ( ( ! empty( $attributes['isShowingViewAll'] ) ) && ( true === $attributes['isShowingViewAll'] ) ) :
			$web_stories_archive    = get_post_type_archive_link( Story_Post_Type::POST_TYPE_SLUG );
			$view_all_stories_label = ( ! empty( $attributes['viewAllLinkLabel'] ) ) ? $attributes['viewAllLinkLabel'] : __( 'View All Stories', 'web-stories' );
			?>

			<div class="web-stories__archive-link">
				<a href="<?php echo( esc_url_raw( $web_stories_archive ) ); ?>">
					<?php echo( esc_html( $view_all_stories_label ) ); ?>
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
	protected function render_story_with_poster( array $story_attrs, $single_story_classes = '' ) {

		if ( empty( $story_attrs['url'] ) || empty( $this->block_attributes ) ) {
			return '';
		}

		$has_content_overlay  = false;
		$single_story_classes = ( ! empty( $single_story_classes ) && is_string( $single_story_classes ) ) ? $single_story_classes : '';
		$current_post_id      = get_the_ID();
		$lightbox_state       = "lightbox{$current_post_id}";

		if ( ! empty( $story_attrs['show_content_overlay'] ) && ( true === $story_attrs['show_content_overlay'] ) ) {
			$has_content_overlay = true;
		}

		if ( ! empty( $story_attrs['poster'] ) ) {
			$poster = $story_attrs['poster'];
		} else {
			$poster = $this->get_fallback_story_poster();
		}

		$list_view_image_alignment = 'left';

		if ( ! empty( $this->block_attributes['imageOnRight'] ) ) {
			$list_view_image_alignment = 'right';
		}

		ob_start();
		?>
		<div class="web-stories__controller">
			<div
				class="<?php echo( esc_attr( $single_story_classes ) ); ?>"
				on="tap:AMP.setState({<?php echo( esc_attr( $lightbox_state ) ); ?>: ! <?php echo( esc_attr( $lightbox_state ) ); ?>})"
			>
				<div
					class="web-stories__story-lightbox story-lightbox"
					[class]="<?php echo( esc_attr( $lightbox_state ) ); ?> ? 'web-stories__story-lightbox show' : 'web-stories__story-lightbox'"
				>
					<div
						class="story-lightbox__close-button"
						on="tap:AMP.setState({<?php echo( esc_attr( $lightbox_state ) ); ?>: false})"
					>
						<span class="story-lightbox__close-button--stick"></span>
						<span class="story-lightbox__close-button--stick"></span>
					</div>
					<amp-story-player
						width="0"
						height="0"
						layout="responsive"
					>
						<a href="<?php echo( esc_url_raw( $story_attrs['url'] ) ); ?>"></a>
					</amp-story-player>
				</div>
				<div class="web-stories__inner-wrapper <?php echo( esc_attr( "image-align-{$list_view_image_alignment}" ) ); ?>">
					<div
						class="web-stories__story-placeholder"
						style="background-image: url(<?php echo( esc_url_raw( $poster ) ); ?>)"
					></div>
					<?php
					if ( true === $has_content_overlay ) :
						?>
						<div
							class="story-content-overlay web-stories__story-content-overlay"
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
								<div class="story-content-overlay__date">
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
				</div>
			</div>
		</div>

		<?php

		return (string) ob_get_clean();
	}

	/**
	 * Returns story attributes based on block attributes.
	 *
	 * @since
	 *
	 * @param int    $story_id             Story's id for which the story attributes are requested.
	 * @param string $single_story_classes Single story's classes.
	 *
	 * @return array An array containing story attributes parsed from the block attributes.
	 */
	protected function get_story_attrs( $story_id, $single_story_classes = '' ) {

		$story_attrs = [];

		if ( empty( absint( $story_id ) ) || empty( $this->block_attributes ) ) {
			return $story_attrs;
		}

		$is_circles_view = $this->is_view_type( 'circles' );
		$image_size      = $is_circles_view ? Media::POSTER_SQUARE_IMAGE_SIZE : Media::POSTER_PORTRAIT_IMAGE_SIZE;
		$story_title     = ( ! empty( $this->block_attributes['isShowingTitle'] ) && ( true === $this->block_attributes['isShowingTitle'] ) ) ?
			get_the_title( $story_id ) :
			'';
		$author_name     = ( ! $is_circles_view && ! empty( $this->block_attributes['isShowingAuthor'] ) && ( true === $this->block_attributes['isShowingAuthor'] ) ) ?
			get_the_author_meta( 'display_name' ) :
			'';
		$story_date      = ( ! $is_circles_view && ! empty( $this->block_attributes['isShowingDate'] ) && ( true === $this->block_attributes['isShowingDate'] ) ) ?
			get_the_date( 'F j, Y' ) :
			'';

		$story_attrs['id']                   = $story_id;
		$story_attrs['url']                  = get_post_permalink( $story_id );
		$story_attrs['title']                = $is_circles_view ? mb_strimwidth( $story_title, 0, 45, '...' ) : $story_title;
		$story_attrs['height']               = '100%';
		$story_attrs['width']                = '100%';
		$story_attrs['poster']               = get_the_post_thumbnail_url( $story_id, $image_size );
		$story_attrs['author']               = $author_name;
		$story_attrs['date']                 = $story_date;
		$story_attrs['class']                = ( is_string( $single_story_classes ) ? $single_story_classes : '' );
		$story_attrs['show_content_overlay'] = ( ! empty( $story_title ) || ! empty( $author_name ) || ! empty( $story_date ) ) ? true : false;

		return wp_parse_args( $story_attrs, $this->default_attrs() );
	}

	/**
	 * Returns 'post_content_filtered' field for current post or for the post of given id.
	 *
	 * @since
	 *
	 * @param int $post_id Post id of the post for which the field value is required. If not passed, will
	 *                     try and get current post in the loop.
	 *
	 * @return string 'post_content_filtered' field's value.
	 */
	protected function get_post_content_filtered( $post_id = null ) {

		$post_content_filtered = new \stdClass();
		$post_obj              = get_post( absint( $post_id ) );

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
	 * Verifies the current view type.
	 *
	 * @since
	 *
	 * @param string $view_type View type to check.
	 *
	 * @return bool Whether or not current view type matches the one passed.
	 */
	protected function is_view_type( $view_type ) {
		if (
			empty( $view_type ) ||
			! is_string( $view_type ) ||
			empty( $this->block_attributes ) ||
			empty( $this->block_attributes['viewType'] )
		) {
			return false;
		}

		if ( $view_type === $this->block_attributes['viewType'] ) {
			return true;
		}

		return false;
	}
}
