import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    
   
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle'
    },
    {
        id: 8,
        isLayout: true
    },
    {
        id: 1000,
        label: 'Crud',
        isTitle: true
    },        
    {
        id: 1002,
        label: 'Autores',
        icon: 'bx-table',
        link: '/autor/autor-listar'
    },  
    {
        id: 1006,
        label: 'Libros',
        icon: 'bx-table',
        link: '/book/book-listar'
    },    
];

