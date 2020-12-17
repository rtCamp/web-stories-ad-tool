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
			'description' => __( 'Display Web Stories in Sidebar section.', 'web-stories' ),
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
		$title = ! empty( $instance['title'] ) ? $instance['title'] : esc_html__( 'Stories', 'web-stories' );
		?>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"><?php echo esc_html__( 'Title:', 'text_domain' ); ?></label>
			<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>">
		</p>
		<p><?php

		//ToDo: Implement Form Controls.
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

}
