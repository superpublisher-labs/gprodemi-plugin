const { registerBlockType } = wp.blocks;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { PanelBody, TextControl, Button, ToggleControl, TextareaControl } = wp.components;
const { createElement, Fragment } = wp.element;
const { MediaUpload, MediaUploadCheck } = wp.blockEditor || wp.editor;
const { __ } = wp.i18n;

const dict = {
    'pt': {
        rediret: {
            true: 'Você será redirecionado para outro site',
            false: 'Você permanecerá no mesmo site'
        },
    },
    'es': {
        rediret: {
            true: 'Te redirigirás a otro sitio',
            false: 'Permanecerás en el mismo sitio'
        },
    },
    default: {
        rediret: {
            true: 'You will be redirected to another website',
            false: 'You will remain on the same site'
        },
    },
};

const targetLocation = (redirect) => {
    return redirect ? '_blank' : '_self';
};

function getRedirectMessage(redirect) {
    const fullLocale = GProdemiSettings.idioma || 'default';
    const langCode = fullLocale.substring(0, 2);
    const idioma = dict[langCode] || dict.default;
    
    return idioma.rediret[String(redirect || false)];
}

if (GProdemiSettings.blocks.linksBlock) {
    registerBlockType('gprodemi/links-block', {
        title: 'Lista de Links',
        icon: 'admin-links',
        category: 'gprodemi-blocks',

        attributes: {
            links: {
                type: 'array',
                default: [
                    { titulo: 'Clique aqui', url: '#' }
                ],
            },
            redirect: {
                type: 'boolean',
                default: false,
            },
        },

        example: {
            attributes: {
                links: [
                    { titulo: 'Clique aqui para ir ao site 1', url: '#1' },
                    { titulo: 'Clique aqui para ir ao site 2', url: '#2' }
                ],
                redirect: false,
            },
        },

        edit: ({ attributes, setAttributes, clientId }) => {
            const links = attributes.links || [];

            const updateLink = (index, key, value) => {
                const newLinks = [...links];
                newLinks[index][key] = value;
                setAttributes({ links: newLinks });
            };

            const addLink = () => {
                setAttributes({ links: [...links, { titulo: 'Clique aqui', url: '#' }] });
            };

            const removeLink = (index) => {
                const newLinks = links.filter((_, i) => i !== index);
                setAttributes({ links: newLinks });
            };

            const removeBlock = () => {
                wp.data.dispatch('core/block-editor').removeBlock(clientId);
            };
            return createElement(
                Fragment,
                null,
                createElement(
                    InspectorControls,
                    null,
                    createElement(
                        PanelBody,
                        { title: 'Configurações dos Links', initialOpen: true },
                        ...links.map((link, index) => {
                            return createElement(
                                'div',
                                { key: index, style: { marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '5px' } },
                                createElement(TextControl, {
                                    label: 'Título',
                                    value: link.titulo,
                                    onChange: (val) => updateLink(index, 'titulo', val)
                                }),
                                createElement(TextControl, {
                                    label: 'URL',
                                    value: link.url,
                                    onChange: (val) => updateLink(index, 'url', val)
                                }),
                                createElement(Button, {
                                    isDestructive: true,
                                    onClick: () => removeLink(index),
                                }, 'Remover')
                            );
                        }),
                        createElement(ToggleControl, {
                            label: 'Redirecionar para outro site',
                            checked: attributes.redirect,
                            onChange: (val) => setAttributes({ redirect: val }),
                        }),
                        createElement(Button, {
                            isPrimary: true,
                            onClick: addLink,
                            style: { marginTop: '10px' }
                        }, 'Adicionar Link'),
                        createElement(Button, {
                            isDestructive: true,
                            isPrimary: true,
                            onClick: removeBlock,
                            style: { marginTop: '10px', marginLeft: '20px' }
                        }, 'Excluir Bloco')
                    )
                ),
                // Preview no editor
                createElement(
                    'div',
                    { className: 'block-linksInternos' },
                    ...links.map((link, index) =>
                        createElement(
                            'a',
                            { key: index, href: link.url, className: 'block-linksInternos-a', target: '_blank' },
                            link.titulo
                        )
                    ),
                    createElement(
                        'span',
                        { className: 'blocoApps-t4' },
                        getRedirectMessage(attributes.redirect),
                    ),
                )
            );
        },

        save: ({ attributes }) => {
            const links = attributes.links || [];
            return createElement(
                'div',
                { className: 'linksInternos' },
                ...links.map((link, index) =>
                    createElement(
                        'a',
                        { key: index, href: link.url, className: 'linksInternos-a', target: targetLocation(attributes.redirect) },
                        link.titulo
                    )
                ),
                createElement(
                    'span',
                    { className: 'blocoApps-t4' },
                    getRedirectMessage(attributes.redirect),
                ),
            );
        },
    });
}

if (GProdemiSettings.blocks.linksRelated) {
    registerBlockType('gprodemi/links-related', {
        title: 'Apps',
        icon: 'cover-image',
        category: 'gprodemi-blocks',

        attributes: {
            imageID: { type: 'number', default: 0 },
            imageURL: { type: 'string', default: GProdemiSettings.placeholderImage },
            link: {
                type: 'string',
                default: '#',
            },
            subtitle: {
                type: 'string',
                default: 'Subtítulo',
            },
            title: {
                type: 'string',
                default: 'Título',
            },
            description: {
                type: 'string',
                default: 'Descrição...',
            },
            cta: {
                type: 'string',
                default: 'CTA',
            },
            redirect: {
                type: 'boolean',
                default: false,
            },
        },

        example: {
            attributes: {
                imageID: 0,
                imageURL: GProdemiSettings.placeholderImage,
                link: '#',
                subtitle: 'Um ',
                title: 'Título',
                description: 'Descrição...',
                cta: 'CTA',
                redirect: false,
            },
        },

        edit: ({ attributes, setAttributes, clientId }) => {
            const onSelectImage = (media) => {
                setAttributes({
                    imageID: media.id,
                    imageURL: media.url
                });
            };

            const removeBlock = () => {
                wp.data.dispatch('core/block-editor').removeBlock(clientId);
            };

            return createElement(
                Fragment,
                null,
                createElement(
                    InspectorControls,
                    null,
                    createElement(
                        PanelBody,
                        { title: 'Configuração do Bloco', initialOpen: true },
                        createElement(
                            MediaUploadCheck,
                            null,
                            createElement(MediaUpload, {
                                onSelect: onSelectImage,
                                allowedTypes: ['image'],
                                value: attributes.imageID,
                                render: ({ open }) =>
                                    createElement(
                                        Button,
                                        { onClick: open, isPrimary: false, style: { marginBottom: '10px' } },
                                        attributes.imageURL ? 'Trocar Imagem' : 'Adicionar Imagem'
                                    )
                            })
                        ),
                        createElement(
                            TextControl,
                            {
                                label: 'Link',
                                value: attributes.link,
                                onChange: (val) => setAttributes({ link: val })
                            }
                        ),
                        createElement(
                            TextControl,
                            {
                                label: 'Subtítulo',
                                value: attributes.subtitle,
                                onChange: (val) => setAttributes({ subtitle: val })
                            }
                        ),
                        createElement(
                            TextControl,
                            {
                                label: 'Título',
                                value: attributes.title,
                                onChange: (val) => setAttributes({ title: val })
                            }
                        ),
                        createElement(
                            TextControl,
                            {
                                label: 'Descrição',
                                value: attributes.description,
                                onChange: (val) => setAttributes({ description: val })
                            }
                        ),
                        createElement(
                            TextControl,
                            {
                                label: 'CTA',
                                value: attributes.cta,
                                onChange: (val) => setAttributes({ cta: val })
                            }
                        ),
                        createElement(ToggleControl, {
                            label: 'Redirecionar para outro site',
                            checked: attributes.redirect,
                            onChange: (val) => setAttributes({ redirect: val }),
                        }),
                        createElement(Button, {
                            isDestructive: true,
                            isPrimary: true,
                            onClick: removeBlock,
                            style: { marginTop: '10px' }
                        }, 'Excluir Bloco')
                    )
                ),
                // Preview no editor
                createElement(
                    'div',
                    { className: 'block-blocoApps' },
                    createElement(
                        'a',
                        { href: attributes.link, className: 'blocoApps-imagem', target: '_blank' },
                        createElement('img', { src: attributes.imageURL, alt: attributes.title }),
                    ),
                    createElement('div', { className: 'blocoApps-textos' },
                        createElement('span', { className: 'blocoApps-t1' }, attributes.subtitle),
                        createElement('span', { className: 'blocoApps-t2' }, attributes.title),
                        createElement('span', { className: 'blocoApps-t3' }, attributes.description),
                        createElement('a', { className: 'block-blocoApps-link', href: attributes.link }, attributes.cta),
                        createElement('span', { className: 'blocoApps-t4' }, getRedirectMessage(attributes.redirect)),
                    )
                )
            );
        },

        save: ({ attributes }) => {
            return createElement(
                'div',
                { className: 'blocoApps' },
                createElement(
                    'a',
                    { href: attributes.link, className: 'blocoApps-imagem', target: targetLocation(attributes.redirect) },
                    createElement('img', { src: attributes.imageURL, alt: attributes.title }),
                ),
                createElement('div', { className: 'blocoApps-textos' },
                    createElement('span', { className: 'blocoApps-t1' }, attributes.subtitle),
                    createElement('span', { className: 'blocoApps-t2' }, attributes.title),
                    createElement('span', { className: 'blocoApps-t3' }, attributes.description),
                    createElement('a', { className: 'blocoApps-link', href: attributes.link }, attributes.cta),
                    createElement('span', { className: 'blocoApps-t4' }, getRedirectMessage(attributes.redirect)),
                )
            )
        },
    });
}

if (GProdemiSettings.blocks.readMore) {
    registerBlockType('gprodemi/read-more', {
        title: 'Leia Também',
        icon: 'ellipsis',
        category: 'gprodemi-blocks',

        attributes: {
            title: {
                type: 'string',
                default: 'Leia Também',
            },
            links: {
                type: 'array',
                default: [
                    { titulo: 'Clique aqui', url: '#' }
                ],
            },
            redirect: {
                type: 'boolean',
                default: false,
            },
        },

        example: {
            attributes: {
                title: 'Leia Também',
                links: [
                    { titulo: 'Clique aqui para ir ao site 1', url: '#1' },
                    { titulo: 'Clique aqui para ir ao site 2', url: '#2' }
                ],
                redirect: false,
            },
        },

        edit: ({ attributes, setAttributes, clientId }) => {
            const links = attributes.links || [];

            const updateLink = (index, key, value) => {
                const newLinks = [...links];
                newLinks[index][key] = value;
                setAttributes({ links: newLinks });
            };

            const addLink = () => {
                setAttributes({ links: [...links, { titulo: 'Clique aqui', url: '#' }] });
            };

            const removeLink = (index) => {
                const newLinks = links.filter((_, i) => i !== index);
                setAttributes({ links: newLinks });
            };

            const removeBlock = () => {
                wp.data.dispatch('core/block-editor').removeBlock(clientId);
            };
            return createElement(
                Fragment,
                null,
                createElement(
                    InspectorControls,
                    null,
                    createElement(
                        PanelBody,
                        { title: 'Configurações dos Links', initialOpen: true },
                        createElement(
                            'div',
                            { style: { marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '5px' } },
                            createElement(TextControl, {
                                label: 'Título',
                                value: attributes.title,
                                onChange: (val) => setAttributes({ title: val })
                            }),
                        ),
                        ...links.map((link, index) => {
                            return createElement(
                                'div',
                                { key: index, style: { marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '5px' } },
                                createElement(TextControl, {
                                    label: 'Título',
                                    value: link.titulo,
                                    onChange: (val) => updateLink(index, 'titulo', val)
                                }),
                                createElement(TextControl, {
                                    label: 'URL',
                                    value: link.url,
                                    onChange: (val) => updateLink(index, 'url', val)
                                }),
                                createElement(Button, {
                                    isDestructive: true,
                                    onClick: () => removeLink(index),
                                }, 'Remover')
                            );
                        }),
                        createElement(ToggleControl, {
                            label: 'Redirecionar para outro site',
                            checked: attributes.redirect,
                            onChange: (val) => setAttributes({ redirect: val }),
                        }),
                        createElement(Button, {
                            isPrimary: true,
                            onClick: addLink,
                            style: { marginTop: '10px' }
                        }, 'Adicionar Link'),
                        createElement(Button, {
                            isDestructive: true,
                            isPrimary: true,
                            onClick: removeBlock,
                            style: { marginTop: '10px', marginLeft: '20px' }
                        }, 'Excluir Bloco')
                    )
                ),
                // Preview no editor
                createElement(
                    'div',
                    null,
                    createElement(
                        'div',
                        { className: 'leiaTambem' },
                        createElement('span', { className: 'leiaTambem-t1' }, attributes.title),
                        createElement('div', { className: 'leiaTambem-links' },
                            ...links.map((link, index) =>
                                createElement(
                                    'a',
                                    { key: index, href: link.url, className: 'block-leiaTambem-link', target: '_blank' },
                                    link.titulo
                                )
                            ),
                        ),
                    ),
                    createElement(
                        'div',
                        { className: 'leiaTambem-footer' },
                        getRedirectMessage(attributes.redirect),
                    ),
                )
            );
        },

        save: ({ attributes }) => {
            const links = attributes.links || [];
            return createElement(
                'div',
                null,
                createElement(
                    'div',
                    { className: 'leiaTambem' },
                    createElement('span', { className: 'leiaTambem-t1' }, attributes.title),
                    createElement('div', { className: 'leiaTambem-links' },
                        ...links.map((link, index) =>
                            createElement(
                                'a',
                                { key: index, href: link.url, className: 'leiaTambem-link', target: '_blank' },
                                link.titulo
                            )
                        ),
                    ),
                ),
                createElement(
                    'div',
                    { className: 'leiaTambem-footer' },
                    getRedirectMessage(attributes.redirect),
                ),
            );
        },
    });
}

if (GProdemiSettings.blocks.faqBlock) {
    registerBlockType('gprodemi/faq-block', {
        title: 'FAQ',
        icon: 'editor-help',
        category: 'gprodemi-blocks',

        attributes: {
            questions: {
                type: 'array',
                default: [
                    { titulo: 'Pergunta', answer: 'Resposta' }
                ],
            },
        },

        example: {
            attributes: {
                questions: [
                    {
                        titulo: 'Esta é uma pergunta de exemplo?',
                        answer: 'Sim, esta é uma resposta de exemplo para mostrar como o bloco ficará.'
                    },
                    {
                        titulo: 'Posso adicionar mais de uma?',
                        answer: 'Com certeza! O preview mostrará todos os itens que você colocar aqui.'
                    }
                ]
            }
        },

        edit: ({ attributes, setAttributes, clientId }) => {
            const questions = attributes.questions || [];

            const updateQuestion = (index, key, value) => {
                const newQuestions = [...questions];
                newQuestions[index][key] = value;
                setAttributes({ questions: newQuestions });
            };

            const addQuestion = () => {
                setAttributes({ questions: [...questions, { titulo: 'Pergunta', answer: 'Resposta' }] });
            };

            const removeQuestion = (index) => {
                const newQuestions = questions.filter((_, i) => i !== index);
                setAttributes({ questions: newQuestions });
            };

            const removeBlock = () => {
                wp.data.dispatch('core/block-editor').removeBlock(clientId);
            };

            return createElement(
                Fragment,
                null,
                createElement(
                    InspectorControls,
                    null,
                    createElement(
                        PanelBody,
                        { title: 'Configurações das Perguntas', initialOpen: true },
                        ...questions.map((quest, index) => {
                            return createElement(
                                'div',
                                { key: index, style: { marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '5px' } },
                                createElement(TextControl, {
                                    label: 'Pergunta',
                                    value: quest.titulo,
                                    onChange: (val) => updateQuestion(index, 'titulo', val)
                                }),
                                createElement(TextareaControl, {
                                    label: 'Resposta',
                                    value: quest.answer,
                                    onChange: (val) => updateQuestion(index, 'answer', val)
                                }),
                                createElement(Button, {
                                    isDestructive: true,
                                    onClick: () => removeQuestion(index),
                                }, 'Remover')
                            );
                        }),
                        createElement(
                            'div',
                            { style: { marginTop: '10px', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: '10px', textAlign: 'center' } },
                            createElement(Button, {
                                isPrimary: true,
                                onClick: addQuestion,
                            }, 'Adicionar Pergunta'),
                            createElement(Button, {
                                isDestructive: true,
                                isPrimary: true,
                                onClick: removeBlock,
                            }, 'Excluir Bloco')
                        )
                    )
                ),
                // Preview no editor

                createElement(
                    'div',
                    { className: 'wp-block-gprodemi-faq-block' },
                    createElement('h2', { className: 'faq-title' }, 'FAQ:'),
                    createElement('div', { className: 'faq-container', 'data-faq-container': true },
                        ...questions.map((quest, index) =>
                            createElement(
                                'details',
                                { key: index, className: 'faq-item', 'data-faq-index': index },
                                createElement('summary', { className: 'block-faq-question' }, quest.titulo),
                                createElement('div', { className: 'faq-answer' }, quest.answer)
                            )
                        ),
                    ),
                ),
            );
        },

        save: ({ attributes }) => {
            const questions = attributes.questions || [];
            return createElement(
                'div',
                { className: 'wp-block-gprodemi-faq-block' },
                createElement('h2', { className: 'faq-title' }, 'FAQ:'),
                createElement('div', { className: 'faq-container', 'data-faq-container': true },
                    ...questions.map((quest, index) =>
                        createElement(
                            'details',
                            { key: index, className: 'faq-item', 'data-faq-index': index, open: index === 0 ? true : undefined },
                            createElement('summary', { className: 'faq-question' }, quest.titulo),
                            createElement('div', { className: 'faq-answer' }, quest.answer)
                        )
                    ),
                ),
            );
        },
    });
}