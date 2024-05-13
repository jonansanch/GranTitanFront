import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn:'root'
})
export class JsonService {
  constructor(private http: HttpClient) {
  }

  getData(url: string) {
    return this.http
      .get<any>(url)
      .toPromise()
      .then(res => <any[]>res)
      .then(data => {
        return data;
      });
  }
}
