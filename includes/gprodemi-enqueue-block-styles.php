<?php

if (!defined('ABSPATH')) exit;

function gprodemi_enqueue_block_styles()
{
    $plugin_data = get_file_data(GPRODEMI_PLUGIN_FILE, array('Version' => 'Version'));
    $version = $plugin_data['Version'];

    wp_enqueue_style(
        'gprodemi-blocks-css',
        GPRODEMI_CSS_URL,
        array(),
        $version
    );

    $font_css = "
        @font-face {
            font-family: 'icomoon';
            src: url('" . GPRODEMI_FONT_ICOMOON . "') format('woff');
            font-weight: 400;
            font-style: normal;
            font-display: block;
        }
    ";

    wp_add_inline_style('gprodemi-blocks-css', $font_css);

    $p_links   = get_option('gprodemi_links_color');
    $p_botao   = get_option('gprodemi_botao_color');
    $p_divider = get_option('gprodemi_divider_color');
    $p_logo    = get_option('gprodemi_logo_color');

    $color_links   = !empty($p_links)   ? $p_links   : get_theme_mod('color_links',   '#000000');
    $color_botao   = !empty($p_botao)   ? $p_botao   : get_theme_mod('color_botao',   '#000000');
    $color_divider = !empty($p_divider) ? $p_divider : get_theme_mod('color_divider', '#000000');
    $color_logo    = !empty($p_logo)    ? $p_logo    : get_theme_mod('color_logo',    '#000000');

    $custom_css = "
        :root {
            --gpp-color-links: "   . esc_attr($color_links)   . " !important;
            --gpp-color-botao: "   . esc_attr($color_botao)   . " !important;
            --gpp-color-divider: " . esc_attr($color_divider) . " !important;
            --gpp-color-logo: "    . esc_attr($color_logo)    . " !important;
        }
    ";

    wp_add_inline_style('gprodemi-blocks-css', $custom_css);
}
add_action('enqueue_block_assets', 'gprodemi_enqueue_block_styles', 20);
