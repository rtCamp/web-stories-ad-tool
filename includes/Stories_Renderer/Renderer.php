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

use Google\Web_Stories\Embed_Base;
use Google\Web_Stories\Interfaces\Renderer as RenderingInterface;
use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Story_Query as Stories;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Traits\Assets;
use Iterator;

/**
 * Renderer class.
 *
 * @SuppressWarnings(PHPMD.ExcessiveClassComplexity)
 * @SuppressWarnings(PHPMD.TooManyPublicMethods)
 * @implements Iterator<int, \WP_Post>
 */
abstract class Renderer implements RenderingInterface, Iterator {

	use Assets;

	/**
	 * Web Stories stylesheet handle.
	 *
	 * @var string
	 */
	const STYLE_HANDLE = 'web-stories-list-styles';

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
	 * Holds required html for the lightbox.
	 *
	 * @var string A string of lightbox markup.
	 */
	protected $lightbox_html = '';

	/**
	 * Pointer to iterate over stories.
	 *
	 * @var int
	 */
	private $position = 0;

	/**
	 * Height for displaying story.
	 *
	 * @var int
	 */
	protected $height = 430;

	/**
	 * Width for displaying story.
	 *
	 * @var int
	 */
	protected $width = 285;

	/**
	 * Whether content overlay is enabled for story.
	 *
	 * @var bool
	 */
	protected $content_overlay;

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
	 * @param array $args Array of rendering arguments.
	 *
	 * @return string
	 */
	public function render( array $args = [] ) {
		foreach ( $args as $key => $val ) {
			if ( property_exists( $this, $key ) ) {
				$this->{$key} = $val;
			}
		}

		return '';
	}

	/**
	 * Retrieve current story.
	 *
	 * @return mixed|void
	 */
	public function current() {
		return $this->story_posts[ $this->position ];
	}

	/**
	 * Retrieve next story.
	 *
	 * @retrun void
	 */
	public function next() {
		++ $this->position;
	}

	/**
	 * Retrieve the key for current node in list.
	 *
	 * @return bool|float|int|string|void|null
	 */
	public function key() {
		return $this->position;
	}

	/**
	 * Check if current position is valid.
	 *
	 * @return bool|void
	 */
	public function valid() {
		return isset( $this->story_posts[ $this->position ] );
	}

	/**
	 * Reset pointer to start of the list.
	 *
	 * @return void
	 */
	public function rewind() {
		$this->position = 0;
	}

	/**
	 * Perform initial setup for object.
	 *
	 * @return void
	 */
	public function init() {
		$this->story_posts = array_map( [ $this, 'prepare_story_modal' ], $this->stories->get_stories() );
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
			WEBSTORIES_VERSION
		);

		if ( ! $this->is_amp_request() ) {

			$this->enqueue_style( Embed_Base::STORY_PLAYER_HANDLE );
			$this->enqueue_script( Embed_Base::STORY_PLAYER_HANDLE );

			$this->enqueue_script( 'web-stories-scripts', [ Embed_Base::STORY_PLAYER_HANDLE ] );

		}
	}

	/**
	 * Determine whether the current request is for an AMP page.
	 *
	 * @return boolean
	 */
	public function is_amp_request() {

		return ( amp_is_request() || is_amp_endpoint() );
	}

	/**
	 * Returns story item data.
	 *
	 * @SuppressWarnings(PHPMD.NPathComplexity)
	 *
	 * @param object $post Array of stories.
	 *
	 * @return object Returns single story item data.
	 */
	public function prepare_story_modal( $post ) {
		if ( ! ( $post instanceof \WP_Post ) ) {
			return $post;
		}

		$is_circles_view = $this->is_view_type( 'circles' );
		$a_post          = $post;
		$story_title     = '';
		$author_name     = '';
		$story_date      = '';
		$story_data      = [];
		$story_id        = $a_post->ID;
		$author_id       = absint( get_post_field( 'post_author', $story_id ) );

		if ( true === $this->attributes['show_title'] ) {
			$story_title = get_the_title( $story_id );
		}

		if ( ! $is_circles_view ) {
			$author_name = ( true === $this->attributes['show_author'] ) ? get_the_author_meta( 'display_name', $author_id ) : $author_name;
			$story_date  = ( true === $this->attributes['show_date'] ) ? get_the_date( 'M j, Y', $story_id ) : $story_date;
		}

		$story_data['id']      = $story_id;
		$story_data['author']  = $author_name;
		$story_data['date']    = $story_date;
		$story_data['classes'] = $this->get_single_story_classes();
		$this->content_overlay = ( ! empty( $story_title ) || ! empty( $author_name ) || ! empty( $story_date ) );
		$transformed_post      = new Story( $story_data );
		$transformed_post->load_from_post( $story_id );

		return $transformed_post;
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

		return ( ! empty( $this->attributes['view_type'] ) ) ? $this->attributes['view_type'] : 'circles';
	}

	/**
	 * Renders stories archive link if the 'show_stories_archive_link' attribute is set to true.
	 *
	 * @return void
	 */
	protected function maybe_render_archive_link() {

		if ( empty( $this->attributes['show_stories_archive_link'] ) || true !== $this->attributes['show_stories_archive_link'] ) {
			return;
		}

		$web_stories_archive = get_post_type_archive_link( Story_Post_Type::POST_TYPE_SLUG );

		if ( empty( $web_stories_archive ) || ! is_string( $web_stories_archive ) ) {
			return;
		}

		?>
		<div class="web-stories-list__archive-link">
			<a href="<?php echo esc_url( $web_stories_archive ); ?>">
				<?php echo esc_html( $this->attributes['stories_archive_label'] ); ?>
			</a>
		</div>
		<?php

	}

	/**
	 * Gets the classes for the block wrapper.
	 *
	 * @return string
	 */
	protected function get_container_classes() {

		$container_classes   = [];
		$container_classes[] = ( ! empty( $this->attributes['align'] ) ) ? sprintf( 'align%1$s', $this->attributes['align'] ) : 'alignnone';

		$container_classes = array_filter( $container_classes );

		return implode( ' ', $container_classes );
	}

	/**
	 * Gets the classes for renderer container.
	 *
	 * @return string
	 */
	protected function get_block_classes() {

		$block_classes   = [];
		$block_classes[] = 'web-stories-list';
		$block_classes[] = ( ! empty( $this->attributes['has_square_corners'] ) ) ? 'is-style-squared' : 'is-style-default';
		$block_classes[] = ( ! empty( $this->attributes['view_type'] ) ) ? sprintf( 'is-view-type-%1$s', $this->attributes['view_type'] ) : 'is-view-type-circles';
		$block_classes[] = ( ! empty( $this->attributes['number_of_columns'] ) ) ? sprintf( 'columns-%1$s', $this->attributes['number_of_columns'] ) : 'columns-3';
		$block_classes[] = ( ! empty( $this->attributes['class'] ) ) ? $this->attributes['class'] : '';

		$block_classes = array_filter( $block_classes );

		return implode( ' ', $block_classes );
	}

	/**
	 * Gets the single story container classes.
	 *
	 * @return string
	 */
	protected function get_single_story_classes() {

		$single_story_classes   = [];
		$single_story_classes[] = 'web-stories-list__story-wrapper';

		$single_story_classes = array_filter( $single_story_classes );
		$classes              = implode( ' ', $single_story_classes );

		/**
		 * Filters the web stories renderer single story classes.
		 *
		 * @param string $class Single story classes.
		 */
		return apply_filters( 'web_stories_renderer_single_story_classes', $classes );
	}

	/**
	 * Render story markup.
	 *
	 * @return void
	 */
	public function render_single_story_content() {
		$single_story_classes = $this->get_single_story_classes();

		$lightbox_state          = "lightbox{$this->current()->get_id()}";
		$lightbox_set_state_attr = ( $this->is_amp_request() ) ? sprintf(
			'on="tap:AMP.setState({%1$s: ! %1$s})"',
			$lightbox_state
		) : '';

		?>

		<div
			class="<?php echo esc_attr( $single_story_classes ); ?>"
			<?php echo wp_kses( $lightbox_set_state_attr, 'on' ); ?>
			style="<?php echo esc_attr( sprintf( '--size:%1$spx', $this->attributes['circle_size'] ) ); ?>"
		>
			<?php
				$this->render_story_with_poster();
			?>
		</div>
		<?php

	}

	/**
	 * Renders a story with story's poster image.
	 *
	 * @return void
	 */
	protected function render_story_with_poster() {

		$story_data            = $this->current();
		$poster_url            = ( 'circles' === $this->get_view_type() ) ? $story_data->get_poster_square() : $story_data->get_poster_portrait();
		$poster_style          = sprintf( 'background-image: url(%1$s); --size:%2$spx', esc_url_raw( $poster_url ), esc_attr( $this->attributes['circle_size'] ) );
		$inner_wrapper_classes = 'web-stories-list__inner-wrapper ';

		if ( true === $this->is_view_type( 'carousel' ) ) {
			$poster_style = sprintf( '%1$s', $poster_style );
		}

		if ( ! empty( $this->attributes['list_view_image_alignment'] ) ) {
			$inner_wrapper_classes .= sprintf( 'image-align-%1$s', $this->attributes['list_view_image_alignment'] );
		}

		?>
		<div class="<?php echo esc_attr( $inner_wrapper_classes ); ?>">
			<div
				class="web-stories-list__story-placeholder"
				style="<?php echo esc_attr( $poster_style ); ?>"
			></div>
			<?php $this->get_content_overlay(); ?>
		</div>
		<?php

		// Start collecting markup for the lightbox stories. This way we don't have to re-run the loop.
		ob_start();

		// Collect story links to fill-in non-AMP lightbox 'amp-story-player'.
		if ( ! $this->is_amp_request() ) {
			?>
				<a href="<?php echo esc_url( $story_data->get_url() ); ?>"><?php echo esc_html( $story_data->get_title() ); ?></a>
			<?php
		}

		// Generate lightbox html for the AMP page.
		if ( $this->is_amp_request() ) {
			$this->generate_amp_lightbox_html();
		}

		$this->lightbox_html .= ob_get_clean();
	}

	/**
	 * Renders a story with amp-story-player.
	 *
	 * @return void
	 */
	protected function render_story_with_story_player() {

		$story_data              = $this->current();
		$height                  = ( ! empty( $this->height ) ) ? absint( $this->height ) : 600;
		$width                   = ( ! empty( $this->width ) ) ? absint( $this->width ) : 360;
		$player_style            = sprintf( 'width: %1$spx;height: %2$spx', $width, $height );
		$story_player_attributes = '';
		$poster_image_url        = ( 'circles' === $this->get_view_type() ) ? $story_data->get_poster_square() : $story_data->get_poster_portrait();
		$poster_style            = '';

		if ( $this->is_amp_request() ) {
			$story_player_attributes = sprintf( 'height=%d width=%d layout="responsive"', esc_attr( $height ), esc_attr( $width ) );
		}

		if ( ! empty( $poster_image_url ) ) {
			$poster_style = sprintf( '--story-player-poster: url(%s)', $poster_image_url );
		}

		?>
		<amp-story-player style="<?php echo esc_attr( $player_style ); ?>"
			<?php echo( $story_player_attributes ); // phpcs:ignore -- Outputs escaped string of attributes. ?>>
			<a href="<?php echo esc_url( $story_data->get_url() ); ?>" style="<?php echo esc_attr( $poster_style ); ?>">
				<?php echo esc_html( $story_data->get_title() ); ?>
			</a>
		</amp-story-player>

		<?php

		$this->get_content_overlay();
	}

	/**
	 * Renders the content overlay markup.
	 *
	 * @return void
	 */
	protected function get_content_overlay() {
		$story_data = $this->current();

		if ( empty( $this->content_overlay ) ) {
			return;
		}

		?>
		<div class="story-content-overlay web-stories-list__story-content-overlay">
			<?php if ( $this->attributes['show_title'] ) { ?>
				<div class="story-content-overlay__title">
					<?php
						echo esc_html( $story_data->get_title() );
					?>
				</div>
			<?php } ?>

			<div class="story-content-overlay__author-date">
				<?php if ( ! empty( $story_data->get_author() ) ) { ?>
					<div>
						<?php

						/* translators: %s: author name. */
						echo esc_html( sprintf( __( 'By %s', 'web-stories' ), $story_data->get_author() ) );
						?>
					</div>
				<?php } ?>

				<?php if ( ! empty( $story_data->get_date() ) ) { ?>
					<time class="story-content-overlay__date">
						<?php

						/* translators: %s: publish date. */
						echo esc_html( sprintf( __( 'On %s', 'web-stories' ), $story_data->get_date() ) );
						?>
					</time>
				<?php } ?>
			</div>
		</div>
		<?php

	}

	/**
	 * Renders the lightbox markup for non-amp pages.
	 *
	 * @return void
	 */
	protected function render_stories_with_lightbox_noamp() {
		$stories = $this->story_posts;
		?>
		<div class="web-stories-list__lightbox">
			<amp-story-player width="0" height="0" layout="responsive">
				<script type="application/json">
					{
						"controls": [
							{
								"name": "close",
								"position": "start"
							},
							{
								"name": "skip-next"
							}
						]
					}
				</script>
				<?php echo wp_kses_post( $this->lightbox_html ); ?>
			</amp-story-player>
		</div>
		<?php
	}

	/**
	 * Markup for the lightbox used on AMP pages.
	 *
	 * @return void
	 */
	protected function generate_amp_lightbox_html() {
		$story          = $this->current();
		$lightbox_state = "lightbox{$story->get_id()}";
		$lightbox_class = "lightbox-{$story->get_id()}";
		?>
		<div
			class="web-stories-list__lightbox <?php echo esc_attr( $lightbox_class ); ?>"
			[class]="<?php echo( esc_attr( $lightbox_state ) ); ?> ? 'web-stories-list__lightbox show' : 'web-stories-list__lightbox'"
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
				<a href="<?php echo( esc_url( $story->get_url() ) ); ?>"><?php echo esc_html( $story->get_title() ); ?></a>
			</amp-story-player>
		</div>
		<?php
	}

	/**
	 * Renders the lightbox markup for non-amp pages.
	 *
	 * @return void
	 */
	protected function render_stories_with_lightbox_amp() {

		// Have to ignore this as the escaping functions are stripping off 'amp-bind' custom attribute '[class]'.
		echo $this->lightbox_html; // phpcs:ignore -- Generated above with properly escaped data.
	}
}
