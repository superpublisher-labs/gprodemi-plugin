<?php

if (!defined('ABSPATH')) exit;

use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

if (!class_exists(PucFactory::class) && file_exists(GPRODEMI_PLUGIN_DIR . '/vendor/autoload.php')) {
    require_once GPRODEMI_PLUGIN_DIR . '/vendor/autoload.php';
}

if (class_exists(PucFactory::class)) {
    $UpdateChecker = PucFactory::buildUpdateChecker(
        'https://github.com/superpublisher-labs/gprodemi-plugin',
        GPRODEMI_PLUGIN_FILE,
        'gprodemi'
    );

    $UpdateChecker->setBranch('master');
}

add_filter('auto_update_plugin', function ($update, $item) {
    if (isset($item->slug) && 'gprodemi' === $item->slug) {
        return true;
    }
    return $update;
}, 10, 2);
