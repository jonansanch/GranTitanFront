import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {TYPE} from "../../components/common/alert/alert.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            map(res => {
                console.log("Passed through the interceptor in response");
                return res
            }),
            catchError((error: HttpErrorResponse) => {
                if (error.status === 0) {
                    console.log("Passed through the interceptor in response");
                    return ;
                }
                if (error.status === 200) {
                    console.log("Passed through the interceptor in response");
                    return ;
                }
                if (error.status === 401) {
                    console.log(error.message);
                    this.Fail(error.message);
                    return ;
                }
                if (error.status === 500) {
                    console.log(error.message);
                    this.Fail('No cuenta con información');
                    return ;
                }
                let errorMsg = '';
                if (error.error instanceof ErrorEvent) {
                    console.log('This is client side error');
                    errorMsg = `Error: ${error.error.message}`;
                } else {
                    console.log('This is server side error');
                    errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
                }
                this.Fail(errorMsg);
                return throwError(errorMsg);
            })
        )
    }

    // Muestra el dialog con sus mensajes y cuando se pulsa Ok dispara el evento
    Generic(content: string, tittle: string = "", $eventClose = null, typeIcon) {
        Swal.fire({
            title: tittle,
            text: content,
            icon: typeIcon,
            showCancelButton: false,
        })

    }

    Fail(content: string = "", title: string = "", $eventClose = null) {
        this.Generic(content, title, $eventClose, TYPE.ERROR);
    }
}
