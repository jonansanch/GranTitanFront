import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from './layouts/layout.component';
import {MsalGuard} from "@azure/msal-angular";

const routes: Routes = [
    //{ path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
    // tslint:disable-next-line: max-line-length
    //{ path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [MsalGuard] },
    { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'})],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
