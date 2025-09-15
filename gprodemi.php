<?php

use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

if (!class_exists(PucFactory::class) && file_exists(__DIR__ . '/vendor/autoload.php')) {
	require_once __DIR__ . '/vendor/autoload.php';
}

if (class_exists(PucFactory::class)) {
	$UpdateChecker = PucFactory::buildUpdateChecker(
		'https://github.com/superpublisher-labs/gprodemi-plugin',
		__FILE__,
		'gprodemi'
	);

	$UpdateChecker->setBranch('master');
}

/**
 * Plugin Name: GProdemi
 * Description: Plugin grupo Prodemi.
 * Version: 0.0.2
 * Author: Prodemi
 * Author URI: https://prodemi.com.br
 * License: GPL2
 * Text Domain: gprodemi
 * Domain Path: /languages
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */

if (! defined('ABSPATH')) {
	exit;
}

define('GPRODEMI_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('GPRODEMI_PLUGIN_FILE', __FILE__);

add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'gprodemi_adicionar_link_configuracoes');

function gprodemi_adicionar_link_configuracoes($links)
{
	$configuracoes = '<a href="admin.php?page=gprodemi">Configurações</a>';
	array_unshift($links, $configuracoes);
	return $links;
}

function gprodemi_ativar_plugin()
{
	error_log('Plugin ativado');
}

function gprodemi_desativar_plugin()
{
	delete_option('gprodemi_token');
	delete_option('default_author');
}

register_activation_hook(__FILE__, 'gprodemi_ativar_plugin');
register_deactivation_hook(__FILE__, 'gprodemi_desativar_plugin');

require_once GPRODEMI_PLUGIN_DIR . 'includes/gprodemi-admin-page.php';
require_once GPRODEMI_PLUGIN_DIR . 'includes/gprodemi-blocks.php';
