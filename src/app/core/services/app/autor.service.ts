import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from "../common/base.service";
import { SessionService } from "../session/session.service";
import { HttpService } from '../../../../app/app-global-services/http-service/http.service';

const baseUrl = `${environment.apiUrl}/api/Author`;

@Injectable({
  providedIn: 'root'
})
export class AutorService extends BaseService {

  constructor(protected http: HttpClient, protected sessionService: SessionService,private httpService: HttpService) {
    super(http, sessionService);
    this.baseUrlApi = baseUrl;
  }

  getAll(): Observable<any> {
    const url = baseUrl + '/GetList';    
    return this.http.get(url, { headers: this.httpService.getHeaders('get') })
      .pipe(map(response => response), catchError(this.handleError));
  }

  get(id: any): Observable<any> {
    return this.Get(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    //return this.Post(data);
    return this.http.post(baseUrl , JSON.stringify(data), { headers: this.httpService.getHeaders('post') });
  }

  update(data: any): Observable<any> {
    return this.http.put(baseUrl , JSON.stringify(data), { headers: this.httpService.getHeaders('put') });
    //return this.Put(data);
  }

  delete(id: any): Observable<any> {
    console.log('id a eliminar' + id);
    return this.Delete(`${baseUrl}/${id}`);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  protected handleError(error: HttpErrorResponse) {
    // return an observable with a user friendly message
    return throwError('Error!.');
  }
}
