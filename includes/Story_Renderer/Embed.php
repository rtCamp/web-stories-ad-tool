<?php
/**
 * Class Embed
 *
 * @package   Google\Web_Stories\Story_Renderer
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


namespace Google\Web_Stories\Story_Renderer;

use Google\Web_Stories\Embed_Base;
use Google\Web_Stories\Model\Story;

/**
 * Class Embed
 *
 * @package Google\Web_Stories\Story_Renderer
 */
class Embed {
	/**
	 * Current post.
	 *
	 * @var Story Post object.
	 */
	protected $story;

	/**
	 * Embed constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param Story $story   Story Object.
	 */
	public function __construct( Story $story ) {
		$this->story = $story;
	}

	/**
	 * Renders the block output in default context.
	 *
	 * @since 1.0.0
	 *
	 * @param array $args Array of Argument to render.
	 *
	 * @return string Rendered block type output.
	 */
	public function render( array $args = [] ) {
		$defaults            = [
			'align'  => 'none',
			'class'  => 'wp-block-web-stories-embed',
			'height' => 600,
			'width'  => 360,
		];
		$args                = wp_parse_args( $args, $defaults );
		$align               = sprintf( 'align%s', $args['align'] );
		$class               = $args['class'];
		$url                 = $this->story->get_url();
		$title               = $this->story->get_title();
		$poster              = ! empty( $this->story->get_poster_portrait() ) ? esc_url( $this->story->get_poster_portrait() ) : '';
		$margin              = ( 'center' === $args['align'] ) ? 'auto' : '0';
		$player_style        = sprintf( 'width: %s;height: %s;margin: %s', $args['width'], $args['height'], esc_attr( $margin ) );
		$poster_style        = ! empty( $poster ) ? sprintf( '--story-player-poster: url(%s)', $poster ) : '';
		$has_content_overlay = ( ! empty( $args['show_content_overlay'] ) && ( true === $args['show_content_overlay'] ) ) ? true : false;

		ob_start();

		if (
			( function_exists( 'amp_is_request' ) && amp_is_request() ) ||
			( function_exists( 'is_amp_endpoint' ) && is_amp_endpoint() )
		) {
			$player_style = sprintf( 'margin: %s', esc_attr( $margin ) );
			?>
			<div class="web-stories__controller">
				<div class="<?php echo esc_attr( $class ); ?>">
					<amp-story-player width="<?php echo esc_attr( $args['width'] ); ?>" height="<?php echo esc_attr( $args['height'] ); ?>" style="<?php echo esc_attr( $player_style ); ?>">
						<a href="<?php echo esc_url( $url ); ?>" style="<?php echo esc_attr( $poster_style ); ?>"><?php echo esc_html( $title ); ?></a>
					</amp-story-player>
					<?php if ( true === $has_content_overlay ) : ?>
					<div
						class="story-content-overlay latest-stories__story-content-overlay"
					>
						<?php if ( ! empty( $args['title'] ) ) : ?>
						<div class="story-content-overlay__title">
							<?php if ( ! empty( $url ) ) : ?>
								<a href="<?php echo( esc_url( $url ) ); ?>">
							<?php endif; ?>
								<?php
								echo( esc_html( $args['title'] ) );
								?>
							<?php if ( ! empty( $url ) ) : ?>
								</a>
							<?php endif; ?>
						</div>
						<?php endif; ?>
						<div class="story-content-overlay__author-date">
						<?php if ( ! empty( $args['author'] ) ) : ?>
							<div class="story-content-overlay__date">
								<?php
								_e( 'By', 'web-stories' );
								echo( esc_html( ' ' . $args['author'] ) );
								?>
								</div>
							<?php endif; ?>
							<?php if ( ! empty( $args['date'] ) ) : ?>
							<time class="story-content-content-overlay__date">
								<?php
								_e( 'On', 'web-stories' );
								echo( esc_html( ' ' . $args['date'] ) );
								?>
							</time>
							<?php endif; ?>
						</div>
					</div>
					<?php endif; ?>
				</div>
			</div>
			<?php

			return (string) ob_get_clean();
		}

		wp_enqueue_style( Embed_Base::STORY_PLAYER_HANDLE );
		wp_enqueue_script( Embed_Base::STORY_PLAYER_HANDLE );
		?>
		<div class="web-stories__controller">
			<div class="<?php echo esc_attr( $class ); ?>">
				<amp-story-player style="<?php echo esc_attr( $player_style ); ?>">
					<a href="<?php echo esc_url( $url ); ?>" style="<?php echo esc_attr( $poster_style ); ?>"><?php echo esc_html( $title ); ?></a>
				</amp-story-player>

				<?php if ( true === $has_content_overlay ) : ?>
				<div
					class="story-content-overlay latest-stories__story-content-overlay"
				>
					<?php if ( ! empty( $args['title'] ) ) : ?>
					<div class="story-content-overlay__title">
						<?php if ( ! empty( $url ) ) : ?>
							<a href="<?php echo( esc_url( $url ) ); ?>">
						<?php endif; ?>
							<?php
							echo( esc_html( $args['title'] ) );
							?>
						<?php if ( ! empty( $url ) ) : ?>
							</a>
						<?php endif; ?>
					</div>
					<?php endif; ?>
					<div class="story-content-overlay__author-date">
					<?php if ( ! empty( $args['author'] ) ) : ?>
						<div class="story-content-overlay__date">
							<?php
							_e( 'By', 'web-stories' );
							echo( esc_html( ' ' . $args['author'] ) );
							?>
							</div>
						<?php endif; ?>
						<?php if ( ! empty( $args['date'] ) ) : ?>
						<time class="story-content-content-overlay__date">
							<?php
							_e( 'On', 'web-stories' );
							echo( esc_html( ' ' . $args['date'] ) );
							?>
						</time>
						<?php endif; ?>
					</div>
				</div>
				<?php endif; ?>

			</div>
		</div>
		<?php
		return (string) ob_get_clean();
	}
}
