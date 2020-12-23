<?php
/**
 * Stories Widgets.
 *
 * @package Google\Web_Stories
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

namespace Google\Web_Stories\Widgets;

use WP_Widget;
use function Google\Web_Stories\get_stories_theme_support;

/**
 * Class Stories
 *
 * @package Google\Web_Stories\Widgets
 */
class Stories extends WP_Widget {

	/**
	 * Widget args.
	 *
	 * @var string[]
	 */
	public $args = array(
		'before_title'  => '<h4 class="widgettitle web-stories-widget-title">',
		'after_title'   => '</h4>',
		'before_widget' => '<div class="widget-wrap web-stories-widget-wrapper">',
		'after_widget'  => '</div>',
	);

	/**
	 * Stories constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		$id_base        = 'web_stories_widget';
		$name           = __( 'Web Stories', 'web-stories' );
		$widget_options = array(
			'description' => __( 'Display Web Stories in Sidebar Section.', 'web-stories' ),
			'classname'   => 'google-stories-widget',
		);

		parent::__construct( $id_base, $name, $widget_options );
	}

	/**
	 * Output widget.
	 *
	 * @param array $args Widget args.
	 * @param array $instance Widget instance.
	 */
	public function widget( $args, $instance ) {
		echo $instance['before_widget'];

		if ( ! empty( $instance['title'] ) ) {
			echo $args['before_title'] . apply_filters( 'widget_title', $instance['title'] ) . $args['after_title'];
		}

		//ToDo: Implement Stories Display.

		echo $instance['after_widget'];
	}

	/**
	 * Display widget form.
	 *
	 * @param array $instance Widget instance.
	 */
	public function form( $instance ) {
		$theme_support = get_stories_theme_support();

		$title             = ! empty( $instance['title'] ) ? $instance['title'] : esc_html__( 'Stories', 'web-stories' );
		$view_types        = $theme_support['view-type'];
		$current_view_type = empty( $instance['view-type'] ) ? $theme_support['view-type-default'] : $instance['view-type'];

		$this->input(
			[
				'id'    => 'title',
				'name'  => 'title',
				'label' => __( 'Widget Title', 'web-stories' ),
				'type'  => 'text',
			]
		);

		$this->dropdown(
			[
				'options'   => $view_types,
				'selected'  => $current_view_type,
				'name'      => 'view-type',
				'id'        => 'view-type',
				'label'     => __( 'Select view type', 'web-stories' ),
				'classname' => 'widefat view-type stories-widget-field'
			]
		);

		$this->input(
			[
				'id'            => 'show_title',
				'name'          => 'show_title',
				'label'         => __( 'Show Title', 'web-stories' ),
				'type'          => 'checkbox',
				'classname'     => 'widefat title stories-widget-field',
				'wrapper_class' => 'title_wrapper',
			]
		);

		$this->input(
			[
				'id'            => 'show_excerpt',
				'name'          => 'show_excerpt',
				'label'         => __( 'Show Excerpt', 'web-stories' ),
				'type'          => 'checkbox',
				'classname'     => 'widefat excerpt stories-widget-field',
				'wrapper_class' => 'excerpt_wrapper',
			]
		);

		$this->input(
			[
				'id'            => 'show_author',
				'name'          => 'show_author',
				'label'         => __( 'Show Author', 'web-stories' ),
				'type'          => 'checkbox',
				'classname'     => 'widefat author stories-widget-field',
				'wrapper_class' => 'author_wrapper',
			]
		);

		$this->input(
			[
				'id'            => 'show_date',
				'name'          => 'show_date',
				'label'         => __( 'Show Date', 'web-stories' ),
				'type'          => 'checkbox',
				'classname'     => 'widefat date stories-widget-field',
				'wrapper_class' => 'date_wrapper',
			]
		);

		$this->input(
			[
				'id'            => 'image_align_right',
				'name'          => 'image_align_right',
				'label'         => __( 'Show Images On Right (default is left)', 'web-stories' ),
				'type'          => 'checkbox',
				'classname'     => 'widefat image_align stories-widget-field',
				'wrapper_class' => 'image_align_wrapper',
			]
		);

		$this->input(
			[
				'id'            => 'archive_link',
				'name'          => 'archive_link',
				'label'         => __( 'Show "View All Stories" link', 'web-stories' ),
				'type'          => 'checkbox',
				'classname'     => 'widefat archive_link stories-widget-field',
				'wrapper_class' => 'archive_link_wrapper',
			]
		);
	}

	/**
	 * Update widget settings.
	 *
	 * @param array $new_instance New instance.
	 * @param array $old_instance Old instance.
	 *
	 * @return array
	 */
	public function update( $new_instance, $old_instance ) {
		$instance          = array();
		$instance['title'] = ( ! empty( $new_instance['title'] ) ) ? wp_strip_all_tags( $new_instance['title'] ) : '';

		//ToDo: Implement Widget Update.

		return $instance;
	}

	/**
	 * Called when the widget is registered.
	 *
	 * @return void
	 */
	public function _register() {
		parent::_register();
		add_action( 'admin_enqueue_scripts', [ $this, 'stories_widget_scripts' ] );
	}

	/**
	 *
	 */
	public function stories_widget_scripts() {
		wp_enqueue_script(
			'web-stories-widget',
			trailingslashit( WEBSTORIES_PLUGIN_DIR_URL ) . 'includes/assets/stories-widget.js',
			[],
			WEBSTORIES_VERSION,
			true
		);
	}

	/**
	 * Display dropdown.
	 *
	 * @param array $args Available view types.
	 */
	private function dropdown( array $args ) {
		$args = wp_parse_args(
			$args,
			[
				'options'       => [],
				'selected'      => '',
				'id'            => wp_generate_uuid4(),
				'name'          => wp_generate_uuid4(),
				'label'         => '',
				'classname'     => 'widefat',
				'wrapper_class' => 'stories-field-wrapper',
			]
		);
		?>
	<p class="<?php printf( '%s', (string) $args['wrapper_class'] ) ?>">

		<label for="<?php echo $this->get_field_id( $args['id'] ) ?>">
			<?php printf( '%s', (string) $args['label'] ) ?>
		</label>

		<select
			class="<?php printf( '%s', (string) $args['classname'] ) ?>"
			id="<?php echo $this->get_field_id( $args['id'] ) ?>"
			name="<?php echo $this->get_field_name( $args['name'] ) ?>"
		>
			<?php

			foreach ( $args['options'] as $key => $type ) { ?>
				<option value="<?php printf( '%s', $key ) ?>">
					<?php printf( '%s', $type ) ?>
				</option>
				<?php
			}
			?>
		</select>
		</p><?php
	}

	/**
	 * Generate an input field.
	 *
	 * @param array $args Array of arguments.
	 *
	 * @return void
	 */
	private function input( array $args ) {
		$args = wp_parse_args(
			$args,
			[
				'type'          => 'text',
				'id'            => wp_generate_uuid4(),
				'name'          => wp_generate_uuid4(),
				'label'         => '',
				'classname'     => 'widefat',
				'wrapper_class' => 'stories-field-wrapper',
			]
		);
		?>
		<p class="<?php printf( '%s', (string) $args['wrapper_class'] ) ?>">
			<label for="<?php echo $this->get_field_id( $args['id'] ) ?>">
				<?php printf( '%s', (string) $args['label'] ) ?>
			</label>

			<input
				class="<?php printf( '%s', (string) $args['classname'] ) ?>"
				type="<?php printf( '%s', (string) $args['type'] ) ?>"
				id="<?php echo $this->get_field_id( $args['id'] ) ?>"
				name="<?php echo $this->get_field_id( $args['name'] ) ?>"
			/>

		</p>
		<?php
	}
}
