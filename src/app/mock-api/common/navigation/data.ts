/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'imports',
        title: 'Control de Importaciones',
        type : 'group',
        icon : 'heroicons_outline:chart-pie',
        children: [
            {
                id   : 'imports.registro',
                title: 'Registro de Importaciones',
                type : 'basic',
                icon : 'heroicons_outline:clipboard-document-check',
                link : '/imports',
            },]
        },
    {
        id   : 'catalogo',
        title: 'Catalogo',
        type : 'collapsable',
        icon : 'heroicons_outline:document',
        link : '/apps/mailbox',
        children: [
            {
                id   : 'catalogo.usuarios',
                title: 'Usuarios',
                type : 'basic',
                icon : 'heroicons_outline:user',
                link : '/users'
            },
            {
                id   : 'catalogo.paises',
                title: 'Paises',
                type : 'basic',
                icon : 'heroicons_outline:cog-8-tooth',
                link : '/paises'
            },
            {
                id   : 'catalogo.anios',
                title: 'Años',
                type : 'basic',
                icon : 'heroicons_outline:rectangle-stack',
                link : '/anios'
            },
            {
                id   : 'catalogo.cupos',
                title: 'Cupos',
                type : 'basic',
                icon : 'heroicons_outline:square-3-stack-3d',
                link : '/cupos'
            },
            {
                id   : 'catalogo.proveedors',
                title: 'Proveedores',
                type : 'basic',
                icon : 'heroicons_outline:sparkles',
                link : '/proveedors'
            },
            {
                id   : 'catalogo.sustancias',
                title: 'Sustancias',
                type : 'basic',
                icon : 'heroicons_outline:magnifying-glass-circle',
                link : '/sustancias'
            },
            {
                id   : 'catalogo.importadors',
                title: 'Importadores',
                type : 'basic',
                icon : 'heroicons_outline:play',
                link : '/importadors'
            },
            {
                id   : 'catalogo.gruposusts',
                title: 'Grupo Sustancias',
                type : 'basic',
                icon : 'heroicons_outline:swatch',
                link : '/gruposusts'
            },
                ]

    }
];

export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
