<?php
/**
 * Class WebStories_Core_Themes_Support
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

namespace Google\Web_Stories\Integrations;

/**
 * Class Jetpack.
 */
class WebStories_Core_Themes_Support {

    /**
	 * Array of themes that are supported.
	 *
	 * @var array
	 */
	protected static $supported_themes = [
		'twentytwentyone',
		'twentytwenty',
		'twentynineteen',
		'twentyseventeen',
		'twentysixteen',
		'twentyfifteen',
		'twentyfourteen',
		'twentythirteen',
		'twentytwelve',
		'twentyeleven',
		'twentyten',
    ];

    /**
	 * Get list of supported core themes.
	 *
	 * @since 1.3.0
	 *
	 * @return string[] Slugs for supported themes.
	 */
	public static function get_supported_themes() {
		return self::$supported_themes;
    }
    
    /**
	 * Adds extra theme support arguments on the fly.
	 *
	 * This will just enable add_theme_support with predefined options for embedding webstories for supported themes.
	 *
	 * @since 1.3.0
	 */
	public static function extend_theme_support() {
		$template = get_template();
		if ( ! in_array( $template, self::get_supported_themes(), true ) ) {
			return;
		}
        
        add_theme_support( 'web-story-options' );

    }

    /**
	 * Embed Webstories.
	 *
	 * This method will embed stories using the predefined customizer options.
	 *
	 * @since 1.3.0
	 */
	public static function embed_web_stories() {
        
        if ( function_exists( 'Customizer::render_stories' ) ) {
            echo Customizer::render_stories();
        }

    }
    
	/**
	 * Initializes all hooks.
	 *
	 * @since 1.3.0
	 *
	 * @return void
	 */
	public function init() {
        
        add_action( 'after_setup_theme', [ $this, 'extend_theme_support' ] );
        
        add_action( 'wp_body_open', [ $this, 'embed_web_stories' ] );
        
	}
}
