import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {BaseService} from "./base.service";
import {SessionService} from "../session/session.service";

const baseUrl = `${environment.apiUrl}/api/Common`;

@Injectable({
    providedIn: 'root'
})
export class CodigosService extends BaseService {

    constructor(protected http: HttpClient, protected sessionService: SessionService) {
        super(http, sessionService);
        this.baseUrlApi = baseUrl;
    }

    getLineasProcesos() {
        let queryParams = new HttpParams();
        queryParams = queryParams.append("dominio", "CODLINEAPROS");
        return this.http.get(baseUrl + '/GetCodigosReferencia', {params: queryParams, headers: this.getHttpHeaders()});
    }

    GetCodigosReferencia(dominio: string): Observable<any[]> {
        let queryParams = new HttpParams();
        queryParams = queryParams.append("dominio", dominio);
        return this.http.get<any[]>(baseUrl + '/GetCodigosReferencia', {
            params: queryParams,
            headers: this.getHttpHeaders()
        });
    }

    GetParametros(idParametro: string): Observable<any[]> {
        let queryParams = new HttpParams();
        queryParams = queryParams.append("idParametro", idParametro);
        return this.http.get<any[]>(baseUrl + '/GetParametros', {params: queryParams, headers: this.getHttpHeaders()});
    }


}
