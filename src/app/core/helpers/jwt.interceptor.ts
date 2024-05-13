import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {lastValueFrom, Observable} from 'rxjs';
import {SessionService} from "../services/session/session.service";
import {Router} from "@angular/router";
import {LoginService} from "../services/auth/login.service";
import {MsalService} from "@azure/msal-angular";
import {catchError} from "rxjs/operators";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private sessionService: SessionService,
                private router: Router,
                private loginService: LoginService,
                private authService: MsalService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loadToken(request);
        return next.handle(request);
    }

    async loadToken(request: HttpRequest<any>) {
        await this.getToken();
    }

    /*async getToken() {
        let loginDisplay = this.sessionService.getItem('loginDisplay');

        if (!loginDisplay) {
            return request;
        }
        let token = this.sessionService.getItem('token');

        if (token) {
            return request;
        }

        let auth: any = await lastValueFrom(this.loginService.Login('').pipe(
            catchError(error => {
                this.sessionService.removeItem('token');
                console.error(error);
                return undefined;
            })
        ));
        if (!auth || !auth.token) {
            this.sessionService.removeItem('token');
            console.error('Error getToken');
            return request;
        }
        this.sessionService.setItem('token', auth.token);
    }*/

    async getToken() {
        if (this.authService.instance.getActiveAccount()) {
            var tokenRequest = {
                scopes: ["user.read", "mail.send"]
            };
            this.authService.instance.acquireTokenSilent(tokenRequest)
                .then(response => {
                    // get access token from response
                    // response.accessToken
                    this.sessionService.setItem('token', response.accessToken);
                })
                .catch(err => {
                    // could also check if err instance of InteractionRequiredAuthError if you can import the class.
                    if (err.name === "InteractionRequiredAuthError") {
                        return this.authService.instance.acquireTokenPopup(tokenRequest)
                            .then(response => {
                                // get access token from response
                                // response.accessToken
                                this.sessionService.setItem('token', response.accessToken);
                            })
                            .catch(err => {
                                console.error(err);
                            });
                    }
                });
        } else {
            // user is not logged in, you will need to log them in to acquire a token
            this.logout(false);
        }
    }

    /**
     * logout
     * @param popup
     */
    logout(popup?: boolean) {
        this.sessionService.removeItem('loginDisplay');
        this.sessionService.removeItem('token');
        if (popup) {
            this.authService.logoutPopup({
                mainWindowRedirectUri: "/"
            });
        } else {
            this.authService.logoutRedirect();
        }
    }
}
