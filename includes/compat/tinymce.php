<?php
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

use Google\Web_Stories\Story_Query;
use Google\Web_Stories\Customizer;

if ( ! function_exists( 'tinymce_web_stories_button' ) ) {
	/**
	 * Add web stories button in TinyMCE editor.
	 *
	 * @param array $buttons Array of TinyMCE buttons.
	 *
	 * @return array
	 */
	function tinymce_web_stories_button( array $buttons ) {
		array_push( $buttons, 'web_stories' );

		return $buttons;
	}

	add_filter( 'mce_buttons', 'tinymce_web_stories_button' );
}

if ( ! function_exists( 'web_stories_mce_plugin' ) ) {
	/**
	 * Register web stories plugin for tinycemce editor.
	 *
	 * @param array $plugins Array of TinyMCE plugin scripts.
	 *
	 * @return array
	 */
	function web_stories_mce_plugin( array $plugins ) {
		$plugins['web_stories'] = trailingslashit( WEBSTORIES_PLUGIN_DIR_URL ) . 'assets/js/web-stories-button.js';

		return $plugins;
	}

	add_filter( 'mce_external_plugins', 'web_stories_mce_plugin' );
}

if ( ! function_exists( 'web_stories_tinymce_scripts' ) ) {
	/**
	 * Enqueue scripts related to tinymce button for web stories.
	 *
	 * @return void
	 */
	function web_stories_tinymce_scripts() {
		if ( is_tinymce_editor() ) {

			wp_enqueue_style(
				'web-stories-mce-components',
				trailingslashit( WEBSTORIES_ASSETS_URL ) . 'css/web-stories-button.css',
				[],
				WEBSTORIES_VERSION
			);
		}
	}

	add_action( 'admin_enqueue_scripts', 'web_stories_tinymce_scripts' );
}

if ( ! function_exists( 'web_stories_tinymce_root_element' ) ) {
	/**
	 * Root element for tinymce editor.
	 * This is useful for performing some react operations.
	 *
	 * @return void
	 */
	function web_stories_tinymce_root_element() {
		if ( is_tinymce_editor() ) {
			echo '<div id="web-stories-tinymce"></div>';
		}
	}

	add_action( 'admin_footer', 'web_stories_tinymce_root_element' );
}

if ( ! function_exists( 'web_stories_tinymce_data' ) ) {
	/**
	 * Put some tinymce related data on the page.
	 *
	 * @return void
	 */
	function web_stories_tinymce_data() {
		if ( ! is_tinymce_editor() ) {
			return;
		}

		$theme_support = Customizer::get_stories_theme_support();
		$order         = $theme_support['order'];
		$views         = $theme_support['view-type'];
		$order_list    = [];
		$view_types    = [];

		foreach ( $order as $order_key => $an_order ) {
			$order_list[] = [
				'label' => $an_order,
				'value' => $order_key,
			];
		}

		foreach ( $views as $view_key => $view_label ) {
			$view_types[] = [
				'label' => $view_label,
				'value' => $view_key,
			];
		}

		$fields       = [
			'title',
			'author',
			'date',
			'image_align',
			'excerpt',
			'archive_link',
		];
		$field_states = [];

		foreach ( $views as $view_type => $view_label ) {
			$field_state = ( new Story_Query( [ 'view_type' => $view_type ] ) )->get_renderer()->field();
			foreach ( $fields as $field ) {
				$field_states[ $view_type ][ $field ] = [
					'show'     => $field_state->$field()->show(),
					'label'    => $field_state->$field()->label(),
					'readonly' => $field_state->$field()->readonly(),
				];
			}
		}

		$data = [
			'orderlist' => $order_list,
			'icon'      => WEBSTORIES_ASSETS_URL . '/src/tinymce/images/carousel.svg',
			'tag'       => 'stories',
			'views'     => $view_types,
			'fields'    => $field_states
		];

		echo "<script type='text/javascript'>\n";
		echo 'var webStoriesMCEData = ' . wp_json_encode( $data ) . ';';
		echo "\n</script>";
	}
	add_action( 'admin_enqueue_scripts', 'web_stories_tinymce_data' );
}

if ( ! function_exists( 'is_tinymce_editor' ) ) {
	/**
	 * Check if current screen is TinyMCE editor.
	 *
	 * @return bool
	 */
	function is_tinymce_editor() {
		global $current_screen;

		if ( ( $current_screen instanceof \WP_Screen ) &&
		property_exists( $current_screen, 'is_block_editor' ) &&
		true === (bool) $current_screen->is_block_editor
		) {
			return true;
		}

		return true;
	}
}
