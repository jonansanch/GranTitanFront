import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from "../../../../environments/environment";
import {SessionService} from "../session/session.service";
import Swal from "sweetalert2";
import {TYPE} from "../../../components/common/alert/alert.component";
import {da} from "@fullcalendar/core/internal-common";

@Injectable({
    providedIn: 'root'
})
export class BaseService {

    protected baseUrlApi: string;
    protected baseUrlAuth: string;
    protected ipAddress: string;

    constructor(protected http: HttpClient, protected sessionService: SessionService) {
        this.baseUrlApi = environment.apiUrl;
        this.baseUrlAuth = environment.apiUrl;
        this.getIP();
    }

    protected getHttpHeaders(): HttpHeaders {
        try {
            let token: string | null = this.sessionService.getItem('token');
            if (!token) {
                //throw new Error('Error No se encontro TOKEN');
                token = 'Token de pruebas comentar cuando este integrado AZURE AD';
            }
            let headers = new HttpHeaders();
            headers = headers.set('Content-Type', 'application/json');
            headers = headers.set('Authorization', 'Bearer ' + token);
            return headers;
        } catch (e) {
            this.handleError(e);
        }
    }

    protected getHttpHeadersPublic(): HttpHeaders {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        return headers;
    }

    /**
     * Error handling
     */
    protected handleError(error: any) {
        console.error('Error message', error);
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message} \n'-' ${error.error}`;
        }
        return this.Fail(errorMessage);
    }

    /**
     * get datasource method
     * @param queryParams
     */
    GetPagination(queryParams: HttpParams) : Observable<any> {        
        return this.http.get(this.baseUrlApi, {headers: this.getHttpHeaders(), params: queryParams});
    }

    /**
     * find by ID method
     * @param requestUrl
     */
    Get(requestUrl: string) : Observable<any> {
        return this.http.get<any>(requestUrl,{headers: this.getHttpHeaders()});
    }

    /**
     * create method
     * @param data
     */
    Post(data: any) : Observable<any> {
        data.fechaRegistro = new Date();
        data.usuarioRegistro = this.getUser();
        data.fechaModifico = new Date();
        data.usuarioModifico = this.getUser();
        return this.http.post(this.baseUrlApi, data, {
            headers: this.getHttpHeaders()
        });
    }

    /**
     * update method
     * @param data
     */
    Put(data: any) : Observable<any> {
        data.fechaModifico = new Date();
        data.usuarioModifico = this.getUser();
        return this.http.put(this.baseUrlApi, data, {
            headers: this.getHttpHeaders()
        });
    }

    /**
     * delete method
     * @param requestUrl
     */
    Delete(requestUrl: string) : Observable<any> {
        return this.http.delete(requestUrl, {
            headers: this.getHttpHeaders()
        });
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

    getUser() {
        let activeAccount = this.sessionService.getItem('activeAccount');
        this.ipAddress = this.sessionService.getItem('ipAddress');
        if(!activeAccount) {
            return this.generateGuid();
        }

        return activeAccount.username;
    }

    getIPAddress()
    {
        return this.http.get<{ip:string}>('https://jsonip.com');
    }

    getIP()
    {
        this.ipAddress = this.sessionService.getItem('ipAddress');
        if(this.ipAddress) {
            return;
        }
        this.getIPAddress().subscribe((res:any)=>{
            this.sessionService.setItem('ipAddress', res.ip);
        });
    }

    generateGuid() : string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
