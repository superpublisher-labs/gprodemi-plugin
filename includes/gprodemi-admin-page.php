<?php
if (! defined('ABSPATH')) exit;

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
    // Pega valores atuais, default 0 (desabilitado)
    $links_block_active = get_option('gprodemi_links_block', 1);
    $links_related_active = get_option('gprodemi_links_related', 1);
    $read_more_active = get_option('gprodemi_read_more', 1);
    $faq_block_active = get_option('gprodemi_faq_block', 1);
    $soccer_block_active = get_option('gprodemi_soccer_block', 1);
    $soccer_block_url = get_option('gprodemi_soccer_block_url', 'http://soccerapi.grupoprodemi.com/');

    // Salva se o formulário for enviado
    if (isset($_POST['save_gprodemi_blocks'])) {
        update_option('gprodemi_links_block', isset($_POST['links_block']) ? 1 : 0);
        update_option('gprodemi_links_related', isset($_POST['links_related']) ? 1 : 0);
        update_option('gprodemi_read_more', isset($_POST['read_more']) ? 1 : 0);
        update_option('gprodemi_faq_block', isset($_POST['faq_block']) ? 1 : 0);
        update_option('gprodemi_soccer_block', isset($_POST['soccer_block']) ? 1 : 0);
        if (isset($_POST['soccer_block_url'])) {
            $url = trim($_POST['soccer_block_url']);

            if (!preg_match('/^https?:\/\//i', $url)) {
                $url = 'https://' . ltrim($url, '/');
            }

            $url = preg_replace('/^http:\/\//i', 'https://', $url);

            update_option('gprodemi_soccer_block_url', $url);
        } else {
            update_option('gprodemi_soccer_block_url', 'http://soccerapi.grupoprodemi.com/');
        }

        echo '<div class="notice notice-success"><p>Configurações salvas!</p></div>';

        // Atualiza os valores para refletir na página
        $links_block_active = get_option('gprodemi_links_block', 1);
        $links_related_active = get_option('gprodemi_links_related', 1);
        $read_more_active = get_option('gprodemi_read_more', 1);
        $faq_block_active = get_option('gprodemi_faq_block', 1);
        $soccer_block_active = get_option('gprodemi_soccer_block', 1);
        $soccer_block_url = get_option('gprodemi_soccer_block_url', 'http://soccerapi.grupoprodemi.com/');
    }
?>
    <div class="wrap">
        <h1>GProdemi</h1>
        <form method="post">
            <label>
                <input type="checkbox" name="links_block" value="1" <?php checked($links_block_active, 1); ?>>
                Lista de links
            </label><br>

            <label>
                <input type="checkbox" name="links_related" value="1" <?php checked($links_related_active, 1); ?>>
                Card de apps
            </label><br>

            <label>
                <input type="checkbox" name="read_more" value="1" <?php checked($read_more_active, 1); ?>>
                Leia Também
            </label><br>

            <label>
                <input type="checkbox" name="faq_block" value="1" <?php checked($faq_block_active, 1); ?>>
                FAQ
            </label><br>

            <div style="display: flex; flex-direction: row; align-items: center; gap: 0.5rem;">
                <label>
                    <input type="checkbox" id="soccer_block" name="soccer_block" value="1" <?php checked($soccer_block_active, 1); ?>>
                    Bloco de Futebol
                </label><br>
                <input type="text" name="soccer_block_url" id="soccer_block_url" value="<?php echo $soccer_block_url; ?>" placeholder="https://urlda.api/">
                <span>A requisição espera endpoints da com os parâmetros: /match?team=id_do_time e /teams?name=nome_do_time</span>
            </div>

            <input type="submit" name="save_gprodemi_blocks" value="Salvar Configurações" class="button button-primary" style="margin-top: 1rem;">
        </form>
    </div>
    <script>
        document.getElementById('soccer_block').addEventListener('change', function() {
            document.getElementById('soccer_block_url').disabled = !this.checked;
        });
    </script>
<?php
}
