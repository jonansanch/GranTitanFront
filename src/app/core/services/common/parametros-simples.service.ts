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
export class ParametrosSimplesService extends BaseService {

  constructor(protected http: HttpClient, protected sessionService: SessionService) {
    super(http, sessionService);
    this.baseUrlApi = baseUrl;
  }

  GetParametrosSimples(nombreParametro: string): Observable<any[]> {
      let queryParams = new HttpParams();
      queryParams = queryParams.append("nombreParametro", nombreParametro);
      return this.http.get<any[]>(baseUrl + '/GetParametrosSimples', {params: queryParams, headers: this.getHttpHeaders()});
  }

}
