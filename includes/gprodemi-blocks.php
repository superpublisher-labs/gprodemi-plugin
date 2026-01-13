<?php
if (!defined('ABSPATH'))
    exit;

// Categoria personalizada
add_filter('block_categories_all', function ($categories) {
    $new_category = [
        [
            'slug' => 'gprodemi-blocks',
            'title' => __('GProdemi Blocos', 'gprodemi'),
            'icon' => 'smiley',
        ]
    ];
    return array_merge($new_category, $categories);
}, 10, 2);

// Enfileira scripts e estilos do editor
add_action('enqueue_block_editor_assets', function () {
    wp_enqueue_style(
        'theme-tailwind',
        get_theme_file_uri('/assets/css/output.css'),
        [],
        filemtime(get_theme_file_path('/assets/css/output.css'))
    );

    wp_enqueue_style(
        'font-awesome',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
        [],
        '6.5.2'
    );

    $js_file = plugin_dir_path(__FILE__) . '../assets/js/block/index.js';
    $js_url = plugins_url('../assets/js/block/index.js', __FILE__);

    wp_enqueue_script(
        'gprodemi-script',
        $js_url,
        ['wp-blocks', 'wp-editor', 'wp-element', 'wp-i18n', 'wp-components'],
        file_exists($js_file) ? filemtime($js_file) : false
    );

    wp_localize_script('gprodemi-script', 'GProdemiSettings', [
        'idioma' => get_locale(),
        'soccerBlockUrl' => get_option('gprodemi_soccer_block_url', 'https://soccerapi.grupoprodemi.com/'),
        'placeholderImage' => plugin_dir_url(__FILE__) . '../assets/img/placeholder.webp',
        'blocks' => [
            'linksBlock' => get_option('gprodemi_links_block', 1),
            'linksRelated' => get_option('gprodemi_links_related', 1),
            'readMore' => get_option('gprodemi_read_more', 1),
            'faqBlock' => get_option('gprodemi_faq_block', 1),
            'soccerBlock' => get_option('gprodemi_soccer_block', 1),
            'soccerBlockUrl' => get_option('gprodemi_soccer_block_url', 'https://soccerapi.grupoprodemi.com/'),
        ]
    ]);
});

add_action('init', function () {
    $blocks = [
        'gprodemi/links-block' => get_option('gprodemi_links_block', 1),
        'gprodemi/links-related' => get_option('gprodemi_links_related', 1),
        'gprodemi/read-more' => get_option('gprodemi_read_more', 1),
        'gprodemi/faq-block' => get_option('gprodemi_faq_block', 1),
        'gprodemi/soccer-block' => get_option('gprodemi_soccer_block', 1),
        'gprodemi/soccer-block-url' => get_option('gprodemi_soccer_block_url', 'https://soccerapi.grupoprodemi.com/'),
    ];

    foreach ($blocks as $block_name => $active) {
        if ($active) {
            register_block_type($block_name, [
                'editor_script' => 'gprodemi-script',
                'editor_style' => ['theme-tailwind'],
                'style' => ['theme-tailwind'],
            ]);
        }
    }
});

add_filter('allowed_block_types_all', function ($allowed_blocks, $editor_context) {

    if ($allowed_blocks === true) {
        $allowed_blocks = array_keys(WP_Block_Type_Registry::get_instance()->get_all_registered());
    }

    $gprodemi_blocks = [
        'gprodemi/links-block' => get_option('gprodemi_links_block', 0),
        'gprodemi/links-related' => get_option('gprodemi_links_related', 0),
        'gprodemi/read-more' => get_option('gprodemi_read_more', 0),
        'gprodemi/faq-block' => get_option('gprodemi_faq_block', 0),
        'gprodemi/soccer-block' => get_option('gprodemi_soccer_block', 0),
        'gprodemi/soccer-block-url' => get_option('gprodemi_soccer_block_url', 'https://soccerapi.grupoprodemi.com/'),
    ];

    return array_filter($allowed_blocks, function ($block) use ($gprodemi_blocks) {
        if (str_starts_with($block, 'gprodemi/')) {
            return !empty($gprodemi_blocks[$block]);
        }
        return true;
    });
}, 10, 2);

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_script('gprodemi-soccer-block', plugins_url('../assets/js/block/soccer-block.js', __FILE__), ['jquery'], null, true);
    wp_localize_script('gprodemi-soccer-block', 'GProdemiSettings', [
        'soccerBlockUrl' => get_option('gprodemi_soccer_block_url', 'https://soccerapi.grupoprodemi.com/'),
        'idioma' => get_locale(),
    ]);
});