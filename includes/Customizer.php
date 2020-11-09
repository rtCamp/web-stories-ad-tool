<?php
/**
 * Class Customizer
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
 * Class Database_Upgrader
 *
 * @package Google\Web_Stories
 */
class Customizer {

	/**
	 * Customizer section slug.
	 *
	 * @var string
	 */
	const SECTION_SLUG = 'web_story_options';

	/**
	 * Experiments instance.
	 *
	 * @var WP_Customize_Manager $wp_customize WP_Customize_Manager instance.
	 */
	private $wp_customize;

	/**
	 * Initializes the customizer logic.
	 */
	public function init() {
		add_action( 'customize_register', [ $this, 'register_customizer_settings' ] );
	}

	/**
	 * Registers customizer settings for web stories.
	 *
	 * @param WP_Customize_Manager $wp_customize WP_Customize_Manager instance.
	 */
	public function register_customizer_settings( $wp_customize ) {

		$this->wp_customize = $wp_customize;

		$options = get_theme_support( 'web-story-options' );

		$view_type         = ( ! empty( $options[0]['view-type'] ) && is_array( $options[0]['view-type'] ) ) ? $options[0]['view-type'] : [];
		$view_type_default = ( ! empty( $options[0]['view-type-default'] ) ) ? $options[0]['view-type-default'] : 'circles';

		$section_title         = ( ! empty( $options[0]['section-title'] ) ) ? $options[0]['section-title'] : false;
		$section_title_default = ( ! empty( $options[0]['section-title-default'] ) ) ? $options[0]['section-title-default'] : 'Visual Stories';

		$show_title         = ( ! empty( $options[0]['title'] ) ) ? $options[0]['title'] : false;
		$show_title_default = ( ! empty( $options[0]['title-default'] ) ) ? $options[0]['title-default'] : false;

		$show_author         = ( ! empty( $options[0]['author'] ) ) ? $options[0]['author'] : false;
		$show_author_default = ( ! empty( $options[0]['author-default'] ) ) ? $options[0]['author-default'] : false;

		$show_date         = ( ! empty( $options[0]['date'] ) ) ? $options[0]['date'] : false;
		$show_date_default = ( ! empty( $options[0]['date-default'] ) ) ? $options[0]['date-default'] : false;

		$show_view_all_link  = ( ! empty( $options[0]['view-all-link'] ) ) ? $options[0]['view-all-link'] : false;
		$view_all_link_label = ( ! empty( $options[0]['view-all-label'] ) ) ? $options[0]['view-all-label'] : 'View all stories';

		$number_of_stories = ( ! empty( $options[0]['number-of-stories'] ) && is_numeric( $options[0]['number-of-stories'] ) ) ? $options[0]['number-of-stories'] : 5;

		$order         = ( ! empty( $options[0]['order'] ) && is_array( $options[0]['order'] ) ) ? $options[0]['order'] : [];
		$order_default = ( ! empty( $options[0]['order-default'] ) ) ? $options[0]['order-default'] : 'latest';

		$loop = ( ! empty( $options[0]['loop'] ) ) ? $options[0]['loop'] : false;

		$autoplay = ( ! empty( $options[0]['autoplay'] ) ) ? $options[0]['autoplay'] : false;

		$delay = ( ! empty( $options[0]['delay'] ) && is_numeric( $options[0]['delay'] ) ) ? $options[0]['delay'] : 5;

		$show_story_poster_default = ( ! empty( $options[0]['show-story-poster-default'] ) ) ? $options[0]['show-story-poster-default'] : true;

		$number_of_columns_default = ( ! empty( $options[0]['grid-columns-default'] ) && is_numeric( $options[0]['grid-columns-default'] ) ) ? $options[0]['grid-columns-default'] : 2;

		// Add Content section.
		$wp_customize->add_section(
			self::SECTION_SLUG,
			[
				'title'          => esc_html__( 'Web Story Options', 'web-stories' ),
				'theme_supports' => 'web-story-options',
			]
		);

		$wp_customize->add_setting(
			'story-options[show_stories]',
			[
				'default' => false,
				'type'    => 'option',
			]
		);

		$wp_customize->add_control(
			'story-options[show_stories]',
			[
				'type'    => 'checkbox',
				'section' => self::SECTION_SLUG,
				'label'   => __( 'Show stories', 'web-stories' ),
			]
		);

		$wp_customize->add_setting(
			'story-options[view_type]',
			[
				'default' => $view_type_default,
				'type'    => 'option',
			]
		);

		$wp_customize->add_control(
			'story-options[view_type]',
			[
				'section'         => self::SECTION_SLUG,
				'label'           => __( 'Story view type', 'web-stories' ),
				'type'            => 'select',
				'choices'         => $this->get_view_type_choices( $view_type ),
				'active_callback' => function() {
					return $this->is_option_enabled( 'show_stories' );
				},
			]
		);

		$wp_customize->add_setting(
			'story-options[number_of_stories]',
			[
				'default'           => $number_of_stories,
				'type'              => 'option',
				'validate_callback' => [ $this, 'validate_number_of_stories' ],
			]
		);

		$wp_customize->add_control(
			'story-options[number_of_stories]',
			[
				'type'            => 'number',
				'section'         => self::SECTION_SLUG,
				'label'           => __( 'Number of stories', 'web-stories' ),
				'input_attrs'     => [
					'min' => 1,
					'max' => 15,
				],
				'active_callback' => function() {
					return $this->is_option_enabled( 'show_stories' );
				},
			]
		);

		$wp_customize->add_setting(
			'story-options[number_of_columns]',
			[
				'default'           => $number_of_columns_default,
				'type'              => 'option',
				'validate_callback' => [ $this, 'validate_number_of_columns' ],
			]
		);

		$wp_customize->add_control(
			'story-options[number_of_columns]',
			[
				'type'            => 'number',
				'section'         => self::SECTION_SLUG,
				'label'           => __( 'Number of columns', 'web-stories' ),
				'input_attrs'     => [
					'min' => 1,
					'max' => 5,
				],
				'active_callback' => function() {
					return ( $this->is_option_enabled( 'show_stories' ) && $this->is_view_type( 'grid' ) );
				},
			]
		);

		if ( true === $section_title ) {

			$wp_customize->add_setting(
				'story-options[section_title]',
				[
					'type'    => 'option',
					'default' => $section_title_default,
				]
			);

			$wp_customize->add_control(
				'story-options[section_title]',
				[
					'type'            => 'text',
					'section'         => self::SECTION_SLUG,
					'label'           => __( 'Section title', 'web-stories' ),
					'active_callback' => function() {
						return $this->is_option_enabled( 'show_stories' );
					},
				]
			);
		}

		$wp_customize->add_setting(
			'story-options[order]',
			[
				'default' => $order_default,
				'type'    => 'option',
			]
		);

		$wp_customize->add_control(
			'story-options[order]',
			[
				'section'         => self::SECTION_SLUG,
				'label'           => __( 'Order by', 'web-stories' ),
				'type'            => 'select',
				'choices'         => $this->get_order_choices( $order ),
				'active_callback' => function() {
					return $this->is_option_enabled( 'show_stories' );
				},
			]
		);


		$wp_customize->add_setting(
			'story-options[list_view_image_alignment]',
			[
				'type'    => 'option',
				'default' => 'left',
			]
		);

		$wp_customize->add_control(
			'story-options[list_view_image_alignment]',
			[
				'type'            => 'radio',
				'section'         => self::SECTION_SLUG,
				'label'           => __( 'Image alignment', 'web-stories' ),
				'choices'         => [
					'left'  => __( 'Left', 'web-stories' ),
					'right' => __( 'Right', 'web-stories' ),
				],
				'active_callback' => function() {
					return ( $this->is_option_enabled( 'show_stories' ) && $this->is_view_type( 'list' ) );
				},
			]
		);

		if ( true === $show_title ) {

			$wp_customize->add_setting(
				'story-options[show_title]',
				[
					'default' => $show_title_default,
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				'story-options[show_title]',
				[
					'type'            => 'checkbox',
					'section'         => self::SECTION_SLUG,
					'label'           => __( 'Show story title', 'web-stories' ),
					'active_callback' => function() {
						return $this->is_option_enabled( 'show_stories' ) && ! $this->is_view_type( 'circles' );
					},
				]
			);
		}

		if ( true === $show_author ) {
			$wp_customize->add_setting(
				'story-options[show_author]',
				[
					'default' => $show_author_default,
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				'story-options[show_author]',
				[
					'type'            => 'checkbox',
					'section'         => self::SECTION_SLUG,
					'label'           => __( 'Show author', 'web-stories' ),
					'active_callback' => function() {
						return ( $this->is_option_enabled( 'show_stories' ) && ! $this->is_view_type( 'circles' ) );
					},
				]
			);
		}

		if ( true === $show_date ) {
			$wp_customize->add_setting(
				'story-options[show_date]',
				[
					'default' => $show_date_default,
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				'story-options[show_date]',
				[
					'type'            => 'checkbox',
					'section'         => self::SECTION_SLUG,
					'label'           => __( 'Show date', 'web-stories' ),
					'active_callback' => function() {
						return ( $this->is_option_enabled( 'show_stories' ) && ! $this->is_view_type( 'circles' ) );
					},
				]
			);
		}

		if ( true === $show_view_all_link ) {
			$wp_customize->add_setting(
				'story-options[show_view_all_link]',
				[
					'default' => false,
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				'story-options[show_view_all_link]',
				[
					'type'            => 'checkbox',
					'section'         => self::SECTION_SLUG,
					'label'           => __( 'Show \'View All Stories\' link', 'web-stories' ),
					'active_callback' => function() {
						return $this->is_option_enabled( 'show_stories' );
					},
				]
			);

			$wp_customize->add_setting(
				'story-options[view_all_label]',
				[
					'type'    => 'option',
					'default' => $view_all_link_label,
				]
			);

			$wp_customize->add_control(
				'story-options[view_all_label]',
				[
					'type'            => 'text',
					'section'         => self::SECTION_SLUG,
					'label'           => __( '\'View All Stories\' label', 'web-stories' ),
					'active_callback' => function() {
						return ( $this->is_option_enabled( 'show_stories' ) && $this->is_option_enabled( 'show_view_all_link' ) );
					},
				]
			);

			$wp_customize->add_setting(
				'story-options[show_story_poster]',
				[
					'default' => $show_story_poster_default,
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				'story-options[show_story_poster]',
				[
					'type'            => 'checkbox',
					'section'         => self::SECTION_SLUG,
					'label'           => __( 'Show story poster only', 'web-stories' ),
					'active_callback' => function() {
						return ( $this->is_option_enabled( 'show_stories' ) && ( $this->is_view_type( 'grid' ) || $this->is_view_type( 'carousel' ) ) );
					},
				]
			);

		}

		if ( true === $loop ) {

			$wp_customize->add_setting(
				'story-options[loop_carousel]',
				[
					'default' => false,
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				'story-options[loop_carousel]',
				[
					'type'            => 'checkbox',
					'section'         => self::SECTION_SLUG,
					'label'           => __( 'Loop', 'web-stories' ),
					'active_callback' => function() {
						return ( $this->is_option_enabled( 'show_stories' ) && $this->is_view_type( 'carousel' ) );
					},
				]
			);
		}

		if ( true === $autoplay ) {

			$wp_customize->add_setting(
				'story-options[autoplay_carousel]',
				[
					'default' => false,
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				'story-options[autoplay_carousel]',
				[
					'type'            => 'checkbox',
					'section'         => self::SECTION_SLUG,
					'label'           => __( 'Autoplay', 'web-stories' ),
					'active_callback' => function() {
						return ( $this->is_option_enabled( 'show_stories' ) && $this->is_view_type( 'carousel' ) );
					},
				]
			);
		}

		$wp_customize->add_setting(
			'story-options[delay]',
			[
				'default'           => $delay,
				'type'              => 'option',
				'validate_callback' => [ $this, 'validate_autoplay_duration' ],
			]
		);

		$wp_customize->add_control(
			'story-options[delay]',
			[
				'type'            => 'number',
				'section'         => self::SECTION_SLUG,
				'label'           => __( 'Delay( in seconds )', 'web-stories' ),
				'input_attrs'     => [
					'min' => 1,
					'max' => 10,
				],
				'active_callback' => function() {
					return ( $this->is_option_enabled( 'show_stories' ) && $this->is_view_type( 'carousel' ) && $this->is_option_enabled( 'autoplay_carousel' ) );
				},
			]
		);

	}

	/**
	 * Gets the view type choices.
	 *
	 * @param array $view_type View type to check.
	 */
	public function get_view_type_choices( $view_type ) {

		if ( empty( $view_type ) ) {
			return [ 'circles' => __( 'Circles', 'web-stories' ) ];
		}

		if ( in_array( 'circles', $view_type ) ) {
			$view_type_choices['circles'] = __( 'Circles', 'web-stories' );
		}

		if ( in_array( 'grid', $view_type ) ) {
			$view_type_choices['grid'] = __( 'Grid', 'web-stories' );
		}

		if ( in_array( 'list', $view_type ) ) {
			$view_type_choices['list'] = __( 'List', 'web-stories' );
		}

		if ( in_array( 'carousel', $view_type ) ) {
			$view_type_choices['carousel'] = __( 'Carousel', 'web-stories' );
		}

		return $view_type_choices;

	}


	/**
	 * Gets the order choices.
	 *
	 * @param array $order An array of order support.
	 */
	public function get_order_choices( $order ) {

		$order_choices = [];

		if ( empty( $order ) ) {
			return [ 'latest' => __( 'Latest', 'web-stories' ) ];
		}

		if ( in_array( 'latest', $order ) ) {
			$order_choices['latest'] = __( 'Latest', 'web-stories' );
		}

		if ( in_array( 'oldest', $order ) ) {
			$order_choices['oldest'] = __( 'Oldest', 'web-stories' );
		}

		if ( in_array( 'asc', $order ) ) {
			$order_choices['asc'] = __( 'A -> Z', 'web-stories' );
		}

		if ( in_array( 'desc', $order ) ) {
			$order_choices['desc'] = __( 'Z -> A', 'web-stories' );
		}

		return $order_choices;

	}

	/**
	 * Checks whether the given option is enabled or not.
	 *
	 * @param string $option_name The name of the option to check.
	 *
	 * @return boolean Returns true if the given option is enabled otherwise false.
	 */
	protected function is_option_enabled( $option_name ) {
		return true === $this->wp_customize->get_setting( "story-options[{$option_name}]" )->value();
	}

	/**
	 * Verifies the current view type.
	 *
	 * @param string $view_type View type to check.
	 *
	 * @return bool Whether or not current view type matches the one passed.
	 */
	protected function is_view_type( $view_type ) {
		return $view_type === $this->wp_customize->get_setting( 'story-options[view_type]' )->value();
	}

	/**
	 * Validates the number of story setting value.
	 *
	 * @param WP_Error $validity WP_Error object.
	 * @param int      $value Value to be validated.
	 *
	 * @return WP_Error
	 */
	public function validate_number_of_stories( $validity, $value ) {
		$value = intval( $value );

		if ( $value <= 0 ) {
			$validity->add( 'invalid_number', __( 'The number of stories must be between 1 and 15.', 'web-stories' ) );
		} elseif ( $value > 15 ) {
			$validity->add( 'invalid_number', __( 'The number of stories must be between 1 and 15.', 'web-stories' ) );
		}
		return $validity;
	}

	/**
	 * Validates the number of columns setting value.
	 *
	 * @param WP_Error $validity WP_Error object.
	 * @param int      $value Value to be validated.
	 *
	 * @return WP_Error
	 */
	public function validate_number_of_columns( $validity, $value ) {
		$value = intval( $value );

		if ( $value <= 0 ) {
			$validity->add( 'invalid_number', __( 'The number of stories must be between 1 and 5.', 'web-stories' ) );
		} elseif ( $value > 5 ) {
			$validity->add( 'invalid_number', __( 'The number of stories must be between 1 and 5.', 'web-stories' ) );
		}
		return $validity;
	}

	/**
	 * Validates the number of columns setting value.
	 *
	 * @param WP_Error $validity WP_Error object.
	 * @param int      $value    Value to be validated.
	 *
	 * @return WP_Error
	 */
	public function validate_autoplay_duration( $validity, $value ) {
		$value = intval( $value );

		if ( $value <= 0 ) {
			$validity->add( 'invalid_number', __( 'The delay duration must be between 1 and 10.', 'web-stories' ) );
		} elseif ( $value > 10 ) {
			$validity->add( 'invalid_number', __( 'The delay duration must be between 1 and 10.', 'web-stories' ) );
		}
		return $validity;
	}

}
