import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';

import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {
    BrowserCacheLocation,
    InteractionType,
    IPublicClientApplication,
    LogLevel,
    PublicClientApplication
} from '@azure/msal-browser';
import {
    MSAL_GUARD_CONFIG,
    MSAL_INSTANCE,
    MSAL_INTERCEPTOR_CONFIG,
    MsalBroadcastService,
    MsalGuard,
    MsalGuardConfiguration,
    MsalInterceptor,
    MsalInterceptorConfiguration,
    MsalModule,
    MsalRedirectComponent,
    MsalService,
} from '@azure/msal-angular';
import {environment} from 'src/environments/environment';
import {AuthInterceptor} from "./core/helpers/auth.interceptor";
import {MsalAdresRoutingModule} from "./msal-adres-routing.module";
import {Error401Component} from "./error/error401.component";

export function loggerCallback(logLevel: LogLevel, message: string) {
    console.log(message);
}

export function MSALInstanceFactory(): IPublicClientApplication {
    return new PublicClientApplication({
        auth: {
            clientId: environment.msalAdresConfig.auth.clientId,
            authority: environment.msalAdresConfig.auth.authority,
            redirectUri: window.location.href,
            postLogoutRedirectUri: window.location.href
        },
        cache: {
            cacheLocation: BrowserCacheLocation.LocalStorage
        },
        system: {
            allowNativeBroker: false, // Disables WAM Broker
            loggerOptions: {
                loggerCallback,
                logLevel: LogLevel.Info,
                piiLoggingEnabled: false
            },
        }
    });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
    const protectedResourceMap = new Map<string, Array<string>>();
    protectedResourceMap.set(environment.apiConfig.uri, environment.apiConfig.scopes);

    return {
        interactionType: InteractionType.Redirect,
        protectedResourceMap
    };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
    return {
        interactionType: InteractionType.Redirect,
        authRequest: {
            scopes: [...environment.apiConfig.scopes]
        },
        loginFailedRoute: window.location.href
    };
}

@NgModule({
    declarations: [
        Error401Component
    ],
    imports: [
        MsalModule,
        MsalAdresRoutingModule,
    ],
    exports: [
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MsalInterceptor,
            multi: true
        },
        {
            provide: MSAL_INSTANCE,
            useFactory: MSALInstanceFactory
        },
        {
            provide: MSAL_GUARD_CONFIG,
            useFactory: MSALGuardConfigFactory
        },
        {
            provide: MSAL_INTERCEPTOR_CONFIG,
            useFactory: MSALInterceptorConfigFactory
        },
        MsalService,
        MsalGuard,
        MsalBroadcastService,
        {
            provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
        },
    ],
    bootstrap: [AppComponent, MsalRedirectComponent]
})
export class MsalAdresModule {
}
