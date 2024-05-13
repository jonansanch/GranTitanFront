import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BookComponent} from "../book/book.component";
import {BookListarComponent} from "./book-listar/book-listar.component";
import {BookCrearComponent} from "./book-crear/book-crear.component";
import {BookEditarComponent} from "./book-editar/book-editar.component";


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'book-listar',
                component: BookListarComponent,
                data: {
                    title: "Book.",
                    breadcrumb: "Book."
                }
            },
            {
                path: 'book-crear',
                component: BookCrearComponent,
                data: {
                    title: "Book",
                    breadcrumb: "Book"
                }
            },
            {
                path: 'Book-editar',
                component: BookEditarComponent,
                data: {
                    title: "Cuenta de Recaudo",
                    breadcrumb: "Cuenta de Recaudo"
                }
            },           
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BookRoutingModule {
}
