import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Error401Component} from "./error/error401.component";

const routes: Routes = [
    {path: 'error401', component: Error401Component}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MsalAdresRoutingModule {
}
