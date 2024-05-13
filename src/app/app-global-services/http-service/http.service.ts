import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(protected http: HttpClient) { }

  getHeaders(typeMethod: string): any {
    if (typeMethod === 'post' || typeMethod === 'put') {
      return new HttpHeaders({'content-type' : 'application/json'});
    } else {
      return new HttpHeaders();
    }
  }

  postJSON(url, data): Observable<HttpResponse<string>> {
    return this.http.post<string>(url, data,
        {
          headers: this.getHeaders('post'),
          observe: 'response'
        }
    );
  }

  postJSONText(url, data): Observable<HttpResponse<string>> {
    return this.http.post<string>(url, data,
        {
          headers: this.getHeaders('post'),
          observe: 'response'
        }
    );
  }

  getRequestWithParams(url, data): Observable<any> {
   const pathUrl = url + '?' + data;
   return this.http.get(pathUrl, {
    headers: this.getHeaders('get'),
    observe: 'response'
    });
  }

  getRequestWithoutParams(url): Observable<any> {
    return this.http.get(url, {
      headers: this.getHeaders('get'),
      observe: 'response'
    });
  }

  getRequest(url, data): Observable<any> {
    return this.http.get(url + '?' + this.listParams(data), { headers: this.getHeaders('get') } );
  }

  listParams(data): string {
    if (data === '') {
        return '';
    } else {
        return Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&');
    }
  }

  deleteWithParams(url, data): Observable<any> {
    return this.http.request('delete', url, {
      headers: this.getHeaders('delete'),
      observe: 'response',
      body: data
    });
  }

  putWithParams(url, data): Observable<any> {
      return this.http.put(url, data, {
        headers: this.getHeaders('put'),
        observe: 'response'
      });
  }

  putWithoutParams(url): Observable<any> {
    return this.http.put(url, { headers: this.getHeaders('put')});
  }
}
