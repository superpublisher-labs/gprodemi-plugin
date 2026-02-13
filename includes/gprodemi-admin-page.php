<?php

if (!defined('ABSPATH')) exit;

add_action('admin_menu', function () {
    add_menu_page(
        'GProdemi',
        'GProdemi',
        'manage_options',
        'gprodemi',
        'gprodemi_admin_page',
        'dashicons-buddicons-activity',
        25
    );
});

function gprodemi_admin_page()
{
    $blocks = [
        'links_block'   => 'Lista de Links',
        'links_related' => 'Card de Apps',
        'read_more'     => 'Leia Também',
        'faq_block'     => 'FAQ',
        'soccer_block'  => 'Bloco de Futebol'
    ];

    $visual_identity = [
        'links_color'   => 'Cor dos Links',
        'botao_color'   => 'Cor dos Botões (CTA)',
        'divider_color' => 'Cor dos Divisores/Linhas',
        'logo_color'    => 'Cor do Placar/Logo'
    ];

    if (isset($_POST['save_gprodemi_settings'])) {
        check_admin_referer('gprodemi_save_settings');

        foreach ($blocks as $key => $label) {
            update_option("gprodemi_{$key}", isset($_POST[$key]) ? 1 : 0);
        }
        foreach ($visual_identity as $key => $label) {
            if (isset($_POST[$key])) {
                update_option("gprodemi_{$key}", sanitize_hex_color($_POST[$key]));
            }
        }

        if (isset($_POST['soccer_block_url'])) {
            $url = esc_url_raw(trim($_POST['soccer_block_url']));
            if (!preg_match('/^https?:\/\//i', $url)) $url = 'https://' . ltrim($url, '/');
            update_option('gprodemi_soccer_block_url', $url);
        }

        echo '<div class="notice notice-success is-dismissible"><p>Configurações salvas!</p></div>';
    }

    $soccer_url = get_option('gprodemi_soccer_block_url', 'https://soccerapi.grupoprodemi.com/');
?>

    <div class="wrap">
        <h1>Configurações GProdemi</h1>

        <form method="post" style="margin-top: 20px; max-width: 850px;">
            <?php wp_nonce_field('gprodemi_save_settings'); ?>

            <div style="display: grid; grid-template-columns: 1fr 300px; gap: 20px;">

                <div>
                    <h2 style="margin-top:0;">Ativação de Blocos</h2>
                    <table class="wp-list-table widefat fixed striped">
                        <thead>
                            <tr>
                                <th style="width: 50px; text-align: center;">Ativo</th>
                                <th>Nome do Bloco</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($blocks as $key => $label) :
                                $is_active = get_option("gprodemi_{$key}", 1);
                            ?>
                                <tr>
                                    <td style="text-align: center; vertical-align: middle;">
                                        <input type="checkbox" name="<?php echo $key; ?>" id="<?php echo $key; ?>" value="1" <?php checked($is_active, 1); ?>>
                                    </td>
                                    <td style="vertical-align: middle;">
                                        <label for="<?php echo $key; ?>"><strong><?php echo $label; ?></strong></label>
                                        <?php if ($key === 'soccer_block') : ?>
                                            <div style="margin-top: 8px; font-size: 11px; color: #666;">
                                                URL da API: <input type="text" name="soccer_block_url" id="soccer_block_url" value="<?php echo esc_url($soccer_url); ?>" class="regular-text" style="height: 25px; font-size: 11px;">
                                            </div>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h2 style="margin-top:0;">Identidade Visual</h2>
                    <div style="background: #fff; border: 1px solid #ccd0d4; padding: 15px; border-radius: 4px; box-shadow: 0 1px 1px rgba(0,0,0,.04);">
                        <?php foreach ($visual_identity as $key => $label) :
                            $color = get_option("gprodemi_{$key}", '#000000');
                        ?>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; font-weight: 600; margin-bottom: 5px;"><?php echo $label; ?></label>
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <input type="color" name="<?php echo $key; ?>" value="<?php echo esc_attr($color); ?>" style="width: 45px; height: 35px; border: 1px solid #ccc; cursor: pointer;">
                                    <code style="font-size: 12px; background: #f0f0f1; padding: 3px 6px;"><?php echo $color; ?></code>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

            </div>

            <p class="submit">
                <input type="submit" name="save_gprodemi_settings" value="Salvar Todas as Configurações" class="button button-primary button-large">
            </p>
        </form>
    </div>

    <script>
        const soccerToggle = document.getElementById('soccer_block');
        const soccerUrl = document.getElementById('soccer_block_url');
        const toggleUrl = () => soccerUrl.disabled = !soccerToggle.checked;
        soccerToggle.addEventListener('change', toggleUrl);
        toggleUrl();
    </script>

    <style>
        .wp-list-table th,
        .wp-list-table td {
            padding: 12px 10px !important;
        }

        input[type="color"]::-webkit-color-swatch-wrapper {
            padding: 0;
        }

        input[type="color"]::-webkit-color-swatch {
            border: none;
            border-radius: 2px;
        }
    </style>
<?php
}
