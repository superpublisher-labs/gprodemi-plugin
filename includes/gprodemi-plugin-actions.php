<?php

if (!defined('ABSPATH')) exit;

add_filter('plugin_action_links_' . plugin_basename(GPRODEMI_PLUGIN_FILE), 'gprodemi_adicionar_link_configuracoes');

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
    error_log('Plugin desativado');
}

register_activation_hook(GPRODEMI_PLUGIN_FILE, 'gprodemi_ativar_plugin');
register_deactivation_hook(GPRODEMI_PLUGIN_FILE, 'gprodemi_desativar_plugin');
