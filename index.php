<?php
	$url = str_replace('?', '', "https://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]" );
?>
<!DOCTYPE html>
<html lang="en-US">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<title>Web Stories Ad Creation Tool</title>

	<!-- /wp-admin/load-styles.php?load[chunk_0]=common -->
	<link rel='stylesheet' href='<?php echo $url; ?>assets/wp/load-style-php.css'/>
	<link rel='stylesheet' crossorigin='anonymous' href='https://fonts.googleapis.com/css?family=Google+Sans%7CGoogle+Sans%3Ab%7CGoogle+Sans%3A500&#038;display=swap&#038;ver=1.7.0-alpha.0'/>
	<link rel='stylesheet' href='<?php echo $url; ?>assets/css/vendors-edit-story.css'/>
	<link rel='stylesheet' href='<?php echo $url; ?>assets/css/vendors-edit-story-rtl.css'/>
	<link rel='stylesheet' href='<?php echo $url; ?>assets/css/edit-story-rtl.css'/>
	<link rel='stylesheet' href='<?php echo $url; ?>assets/css/edit-story.css'/>
	<script>
		var webStoriesAdConfig = {
		  url: '<?php echo $url; ?>'
		}
	</script>
</head>
<body class="edit-story no-js">

	<script type="text/javascript">
	  document.body.className = document.body.className.replace( 'no-js', 'js' );
	</script>

	<div class="app">
		<h1 class="screen-reader-text hide-if-no-js">Web Stories Ad Creation Tool</h1>
		<div id="web-stories-editor" class="web-stories-editor-app-container hide-if-no-js">
			<h1 class="loading-message align-center">Please wait...</h1>
		</div>

		<div class="wrap hide-if-js web-stories-wp-no-js">
			<h1 class="wp-heading-inline">Web Stories</h1>
			<div class="notice notice-error notice-alt">
				<p>Web Stories Ad Creation Tool requires JavaScript. Please enable JavaScript in your browser settings.</p>
			</div>
		</div>
	</div>

	<script src='<?php echo $url; ?>assets/wp/wp-polyfill.min.js'></script>
	<script src='<?php echo $url; ?>assets/wp/load-scripts.js'></script> <!-- /wp-admin/load-scripts.php?load[chunk_0]=wp-i18n -->
	<script src='<?php echo $url; ?>assets/wp/url.min.js'></script>
	<script src='<?php echo $url; ?>assets/wp/api-fetch.min.js'></script>

	<?php
	$chunks_file =  __DIR__ . '/assets/js/edit-story.chunks.php';
	$chunks = is_readable( $chunks_file ) ? require $chunks_file : [];

	if ( ! empty( $chunks['js'] ) && is_array( $chunks['js'] ) ) {
		foreach ( $chunks['js'] as $file_name ) {
			printf( '<script src="%sassets/js/%s.js"></script>', $url, $file_name );
		}
	}
	?>
	<script src='<?php echo $url; ?>assets/js/edit-story.js'></script>

</body>
</html>
