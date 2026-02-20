<?php

/**
 * Plugin Name: GProdemi
 * Description: Plugin grupo Prodemi
 * Version: 0.0.11
 * Author: Prodemi
 * Author URI: https://prodemi.com.br
 * License: Apache License 2.0
 * Text Domain: gprodemi
 * Domain Path: /languages
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */

if (!defined('ABSPATH')) exit;

require_once __DIR__ . '/config.php';

require_once GPRODEMI_PLUGIN_DIR . 'includes/gprodemi-update-checker.php';
require_once GPRODEMI_PLUGIN_DIR . 'includes/gprodemi-plugin-actions.php';
require_once GPRODEMI_PLUGIN_DIR . 'includes/gprodemi-enqueue-block-styles.php';
require_once GPRODEMI_PLUGIN_DIR . 'includes/gprodemi-admin-page.php';
require_once GPRODEMI_PLUGIN_DIR . 'includes/gprodemi-blocks.php';
