<?php

if (!defined('WP_UNINSTALL_PLUGIN')) exit;

$gprodemi_options = [
    'gprodemi_links_block',
    'gprodemi_links_related',
    'gprodemi_read_more',
    'gprodemi_faq_block',
    'gprodemi_soccer_block',
    'gprodemi_soccer_block_url',
    'gprodemi_links_color',
    'gprodemi_botao_color',
    'gprodemi_divider_color',
    'gprodemi_logo_color',
];

foreach ($gprodemi_options as $option) {
    delete_option($option);
}
