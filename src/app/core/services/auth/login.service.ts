import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {BaseService} from "../common/base.service";
import {Observable} from "rxjs";
import {SessionService} from "../session/session.service";

const baseUrl = `${environment.apiUrl}/api/Login`;

@Injectable({
    providedIn: 'root'
})
export class LoginService extends BaseService {

    constructor(protected http: HttpClient, protected sessionService: SessionService) {
        super(http, sessionService);
    }

    Login(username: string) : Observable<any>{
        return this.http.post(baseUrl, {
            "username": username ? username : 'prueba@bisa'
        });
    }

}
