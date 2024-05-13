import {Inject, Injectable, OnDestroy, OnInit} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService} from "@azure/msal-angular";
import {
    AuthenticationResult,
    EventMessage,
    EventType,
    InteractionStatus,
    PopupRequest,
    SilentRequest
} from '@azure/msal-browser';
import {catchError, filter, takeUntil} from 'rxjs/operators';
import {SessionService} from "../services/session/session.service";
import {createClaimsTable} from "../../utils/claim-utils";

@Injectable()
export class AuthInterceptor implements OnInit, OnDestroy, HttpInterceptor {

    title = 'Angular 16 - MSAL Angular v3 Sample';
    isIframe = false;
    loginDisplay = false;
    displayedColumns: string[] = ['claim', 'value', 'description'];
    dataSource: any = [];
    private readonly _destroying$ = new Subject<void>();

    constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
                private authService: MsalService,
                private msalBroadcastService: MsalBroadcastService,
                private sessionService: SessionService
    ) {
        this.ngOnInit();
    }

    /**
     * AzureAD authenticate
     * @param req
     * @param next
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let request = req;

        this.loginDisplay = this.sessionService.getItem('loginDisplay');
        if (this.loginDisplay) {
            this.checkAndSetActiveAccount();
            return next.handle(request);
        }

        if (!this.loginDisplay) {
            this.login().then();
        }

        return next.handle(request).pipe(catchError(err => {
            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }

    ngOnInit(): void {
        try {
            this.msalBroadcastService.msalSubject$
                .pipe(
                    filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
                )
                .subscribe((result: EventMessage) => {
                    console.log(result);
                    const payload = result.payload as AuthenticationResult;
                    this.authService.instance.setActiveAccount(payload.account);
                });

            this.msalBroadcastService.inProgress$
                .pipe(
                    filter((status: InteractionStatus) => status === InteractionStatus.None)
                )
                .subscribe(() => {
                    this.setLoginDisplay();
                })
        } catch (error) {
            throwError(error);
        }
    }

    /**
     * set loginDisplay
     * @private
     */
    private setLoginDisplay() {
        this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
        this.sessionService.setItem('loginDisplay', this.loginDisplay);
    }

    /**
     * invoke methods login
     */
    async login() {
        await this.afterLoad();
        await this.loginRedirect();
    }

    /**
     * load azureAD resources
     */
    async afterLoad() {
        setTimeout(() => {
            this.isIframe = window !== window.parent && !window.opener; // Remove this line to use Angular Universal
            this.setLoginDisplay();

            this.authService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window
            this.msalBroadcastService.msalSubject$
                .pipe(
                    filter((msg: EventMessage) => msg.eventType === EventType.ACCOUNT_ADDED || msg.eventType === EventType.ACCOUNT_REMOVED),
                )
                .subscribe((result: EventMessage) => {
                    if (this.authService.instance.getAllAccounts().length === 0) {
                        window.location.pathname = "/";
                    } else {
                        this.setLoginDisplay();
                    }
                });

            this.msalBroadcastService.inProgress$
                .pipe(
                    filter((status: InteractionStatus) => status === InteractionStatus.None),
                    takeUntil(this._destroying$)
                )
                .subscribe(() => {
                    this.setLoginDisplay();
                    this.checkAndSetActiveAccount();
                });
        });
    }

    /**
     * validate user authenticate
     */
    checkAndSetActiveAccount() {
        /**
         * If no active account set but there are accounts signed in, sets first account to active account
         * To use active account set here, subscribe to inProgress$ first in your component
         * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
         */
        let activeAccount = this.authService.instance.getActiveAccount();

        if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
            let accounts = this.authService.instance.getAllAccounts();
            this.authService.instance.setActiveAccount(accounts[0]);
        }
        this.getToken();
    }

    /**
     * login redirect page
     */
    async loginRedirect() {
        setTimeout(() => {
            if (this.msalGuardConfig.authRequest) {
                this.authService.acquireTokenSilent({...this.msalGuardConfig.authRequest} as SilentRequest)
                    .subscribe((response: AuthenticationResult) => {
                        this.authService.instance.setActiveAccount(response.account);
                        this.sessionService.setItem('token', response.accessToken);
                        console.log(this.authService.instance.getAllAccounts());
                    });
            } else {
                this.authService.loginRedirect();
            }
        });
    }

    /**
     * use popup redirect page
     */
    async loginPopup() {
        if (this.msalGuardConfig.authRequest) {
            this.authService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest)
                .subscribe((response: AuthenticationResult) => {
                    this.authService.instance.setActiveAccount(response.account);
                });
        } else {
            this.authService.loginPopup()
                .subscribe((response: AuthenticationResult) => {
                    this.authService.instance.setActiveAccount(response.account);
                });
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

    ngOnDestroy(): void {
        this._destroying$.next(undefined);
        this._destroying$.complete();
    }

    async getToken() {
        let token = this.sessionService.getItem('token');
        if (token) {
            return;
        }
        let activeAccount = this.authService.instance.getActiveAccount();
        if (!activeAccount && this.msalGuardConfig.authRequest) {
            // user is not logged in, you will need to log them in to acquire a token
            this.logout(false);
            return;
        }
        this.getClaims(activeAccount.idTokenClaims);
        this.sessionService.setItem('activeAccount', activeAccount);
        var tokenRequest = {
            scopes: ["user.read", activeAccount.username]
        };
        this.authService.instance.acquireTokenSilent({...this.msalGuardConfig.authRequest} as SilentRequest)
            .then(response => {
                // get access token from response
                // response.accessToken
                this.sessionService.setItem('token', response.accessToken);
            })
            .catch(err => {
                // could also check if err instance of InteractionRequiredAuthError if you can import the class.
                if (err.name === "InteractionRequiredAuthError") {
                    return this.authService.instance.acquireTokenByCode(tokenRequest)
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
    }


    getClaims(claims: any) {
        if (claims) {
            const claimsTable = createClaimsTable(claims);
            this.dataSource = [...claimsTable];
        }
    }
}
