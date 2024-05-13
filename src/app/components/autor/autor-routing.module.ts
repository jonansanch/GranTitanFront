import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutorComponent } from "../autor/autor.component";
import { AutorListarComponent } from "./autor-listar/autor-listar.component";
import { AutorCrearComponent } from "./autor-crear/autor-crear.component";
import { AutorEditarComponent } from "./autor-editar/autor-editar.component";


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'autor-listar',
                component: AutorListarComponent,
                data: {
                    title: "Autor.",
                    breadcrumb: "Autor."
                }
            },
            {
                path: 'autor-crear',
                component: AutorCrearComponent,
                data: {
                    title: "Autor",
                    breadcrumb: "Autor"
                }
            },            
            {
                path: 'autor-editar',
                component: AutorEditarComponent,
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
export class AutorRoutingModule {
}
