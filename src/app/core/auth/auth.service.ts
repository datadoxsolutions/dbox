import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { DBXHttpService } from '../dbx-http/dbx-http.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { _throw } from 'rxjs/Observable/throw';
@Injectable()
export class AuthenticationService {
  userLogin: boolean;
  userDetails: any;
  constructor(private http: Http, private DBXHttp: DBXHttpService, private cookieService: CookieService) {
    console.log(this.cookieService.get('FLOWABLE_REMEMBER_ME'));
    this.isUserLogin(); }
    login(user: string, password: string) {
      // tslint:disable-next-line:prefer-const
      let payload = {
        j_username: user,
        j_password: password,
        submit: 'Login',
        _spring_security_remember_me: 'true'
      };

      const httpOptions = {
        headers: new Headers({
            'Access-Control-Allow-Credential': true,
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/x-www-form-urlencoded'
        }),
        observe: 'response' as 'response',
        withCredentials: true
      };
      // tslint:disable-next-line:max-line-length
      return this.http.post(environment.api_endpoint + 'DB-idm/app/authentication', new URLSearchParams(payload).toString(), httpOptions).pipe(catchError(this.handleError));
    }

    setAuthenticateUser() {
      return this.http.get( environment.api_endpoint + 'DB-idm/app/rest/authenticate');
    }

    isUserLogin() {
      console.log(this.cookieService.get('FLOWABLE_REMEMBER_ME'));
      return (localStorage.getItem('userLoginIn')) ? true : false;
    }


    isTaskAppSelected() {
      return (localStorage.getItem('seletedApp')) ? JSON.parse(localStorage.getItem('seletedApp')) : {};
    }

    logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('agentCurrentUser');
      localStorage.removeItem('currentRestaurant');
    }

    private handleError(error: any) {
      return _throw(error._body);
    }
}
