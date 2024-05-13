import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';

import {environment} from '../environments/environment';

import {TabsModule} from 'ngx-bootstrap/tabs';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {AccordionModule} from 'ngx-bootstrap/accordion';

import {CarouselModule} from 'ngx-owl-carousel-o';
import {ScrollToModule} from '@nicky-lenaers/ngx-scroll-to';

import {LayoutsModule} from './layouts/layouts.module';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {initFirebaseBackend} from './authUtils';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {ErrorInterceptor} from './core/helpers/error.interceptor';
import {FakeBackendInterceptor} from './core/helpers/fake-backend';
import {ToastrModule} from 'ngx-toastr';
import {MsalAdresModule} from "./msal-adres.module";


import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MaterialModule } from '../app/material.module';
import { MatCheckboxDefaultOptions, MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CoreModule } from './core/core.module';

if (environment.defaultauth === 'firebase') {
    initFirebaseBackend(environment.firebaseConfig);
} else {
    // tslint:disable-next-line: no-unused-expression
    FakeBackendInterceptor;
}

export function createTranslateLoader(http: HttpClient): any {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        //MsalAdresModule,
        LayoutsModule,
        AppRoutingModule,
        CarouselModule,
        AccordionModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        ScrollToModule.forRoot(),
        ToastrModule.forRoot(),

        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatSidenavModule,
        MatTabsModule,
        MatTableModule,        
        MatSelectModule,
        MatFormFieldModule,
        MaterialModule,
        MatToolbarModule,        
        MatInputModule, 

        // Core module of your application
        CoreModule,
    ],
    bootstrap: [AppComponent],
    providers: [
        //{provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        //{provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true},
        // LoaderService,
        // { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true },
    ],
})
export class AppModule {
}
