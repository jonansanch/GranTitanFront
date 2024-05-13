import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './dashboards/default/default.component';
import {MsalGuard} from "@azure/msal-angular";

const routes: Routes = [
  // { path: '', redirectTo: 'dashboard' },
  {
    path: "",
    component: DefaultComponent
  },
  {
    path: 'dashboard', component: DefaultComponent
  },
  {
    path: 'dashboards', 
    loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule),
    canActivate: [
      //MsalGuard
    ]
  },     
  {
    path: 'autor',
    loadChildren: () => import('../../app/components/autor/autor.module').then(m => m.AutorModule),
    canActivate: [
      //MsalGuard
    ]
  },  
  {
    path: 'book',
    loadChildren: () => import('../../app/components/book/book.module').then(m => m.BookModule),
    canActivate: [
      //MsalGuard
    ]
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
