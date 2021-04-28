<?php

namespace Deployer;

//adds common necessities for the deployment
require 'recipe/common.php';

set( 'ssh_type', 'native' );
set( 'ssh_multiplexing', true );

set( 'default_timeout', 1500 );

if ( file_exists( 'vendor/deployer/recipes/recipe/rsync.php' ) ) {
	require 'vendor/deployer/recipes/recipe/rsync.php';
} else {
	require getenv( 'COMPOSER_HOME' ) . '/vendor/deployer/recipes/recipe/rsync.php';
}

inventory( '/hosts.yml' );

$deployer = Deployer::get();
$hosts    = $deployer->hosts;

foreach ( $hosts as $host ) {
	$host
		->addSshOption( 'UserKnownHostsFile', '/dev/null' )
		->addSshOption( 'StrictHostKeyChecking', 'no' );

	$deployer->hosts->set( $host->getHostname(), $host );
}

// Add tests and other directory uncessecary for
// production to exclude block.
set( 'rsync', [
	'exclude'       => [
		'.git',
		'.github',
		'deploy.php',
		'.env',
		'.env.example',
		'.gitignore',
		'.gitlab-ci.yml',
		'Gruntfile.js',
		'README.md',
		'gulpfile.js',
		'.circleci',
		'phpcs.xml'
	],
	'exclude-file'  => true,
	'include'       => [],
	'include-file'  => false,
	'filter'        => [],
	'filter-file'   => false,
	'filter-perdir' => false,
	'flags'         => 'rz', // Recursive, with compress
	'options'       => [ 'delete', 'delete-excluded', 'links', 'no-perms', 'no-owner', 'no-group' ],
	'timeout'       => 300,
] );
set( 'rsync_src', getenv( 'build_root' ) );
set( 'rsync_dest', '{{release_path}}' );


/*  custom task defination    */
desc( 'Download cachetool' );
task( 'cachetool:download', function () {
	run( 'wget https://raw.githubusercontent.com/gordalina/cachetool/gh-pages/downloads/cachetool-3.0.0.phar -O {{release_path}}/cachetool.phar' );
} );

desc( 'Configure plugin' );
task( 'setup:webstories', function () {
	run( 'cd {{release_path}} && \
	export CI=true && \
	export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true && \
	echo "Removing node_modules if exists" && rm -rf node_modules && \
	npm ci && \
	npx rollup --config packages/migration/src/rollup.config.migrate.js && \
	composer install --prefer-dist --no-suggest --no-progress --no-interaction && \
	npm run build && \
	rm -rf node_modules
	' );
} );

/*  custom task defination    */
desc( 'Reset opcache' );
task( 'opcache:reset', function () {

	cd( '{{deploy_path}}' );
	$output = run( 'ee shell --command="php /var/www/current/cachetool.phar opcache:reset --fcgi=127.0.0.1:9000" --skip-tty' );
	run( 'ee shell --command="rm /var/www/current/cachetool.phar" --skip-tty' );
	writeln( '<info>' . $output . '</info>' );
} );

/*
 * Change permissions to 'www-data' for 'current/',
 * so that 'wp-cli' can read/write files.
 */
desc( 'Correct Permissions' );
task( 'permissions:set', function () {
	$output = run( 'chown -R www-data:www-data {{release_path}}' );
	writeln( '<info>' . $output . '</info>' );
} );

/*   deployment task   */
desc( 'Deploy the project' );
task( 'deploy', [
	'deploy:prepare',
	'deploy:unlock',
	'deploy:lock',
	'deploy:release',
	'rsync',
	'cachetool:download',
	'setup:webstories',
	'deploy:shared',
	'deploy:symlink',
	'permissions:set',
	'opcache:reset',
	'deploy:unlock',
	'cleanup'
] );
after( 'deploy', 'success' );
