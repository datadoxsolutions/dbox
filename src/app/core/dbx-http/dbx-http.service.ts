import { Injectable } from '@angular/core';
import { ConnectionBackend, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { _throw } from 'rxjs/Observable/throw';
@Injectable()
export class DBXHttpService {
    constructor(defaultOptions: RequestOptions, private http: Http) {  }
    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
      return this.http.get(environment.api_endpoint + url, this.addJwt(options)).pipe(
        map((response: Response) => response.json()),
        catchError(this.handleError));
    }

    post(url: string, body: any, options?: RequestOptionsArgs, multipart: boolean = false): Observable<Response> {
      // tslint:disable-next-line:max-line-length
      return this.http.post(environment.api_endpoint + url, body, this.addJwt(options, multipart)).pipe( map((response: Response) => {
        console.log(response);
        console.log(response.totalBytes);
        // tslint:disable-next-line:only-arrow-functions
        try {
          return response.json();
        } catch (error) {
          console.log(error);
        }
      }), catchError(this.handleError));
    }

    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.put(environment.api_endpoint + url, body, this.addJwt(options)).pipe(catchError(this.handleError));
    }

    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
      return this.http.patch(environment.api_endpoint + url, body, this.addJwt(options)).pipe(catchError(this.handleError));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.delete(environment.api_endpoint + url, this.addJwt(options)).pipe(catchError(this.handleError));
    }

    // private helper methods
    private addJwt(options?: RequestOptionsArgs, multipart: boolean = false): RequestOptionsArgs {
        // ensure request options and headers are not null
        options = options || new RequestOptions();
        options.headers = options.headers || new Headers();
        if (multipart) {
          // tslint:disable-next-line:quotemark
          options.headers.set('Content-Type', "multipart/form-data;");
        } else {
          // tslint:disable-next-line:quotemark
          options.headers.append('Content-Type', "application/json");
        }
        options.withCredentials = true;
        // options.headers.append('Access-Control-Allow-Origin', '*');
        // options.headers.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // tslint:disable-next-line:max-line-length
        // options.headers.append('Cookie', 'FLOWABLE_REMEMBER_ME=amNPZmxIRE1tckVjVmNUSmliWHJaUSUzRCUzRDpJelhYWjNGJTJCN0ZPJTJCRHJhYmhUVDNhZyUzRCUzRA; _ga=GA1.1.1267614065.1562676340; _gid=GA1.1.2009369032.1562676340');
        // // add authorization header with jwt token
        return options;
    }
    private handleError(error: any) {
      console.log(error);
      if (error.status === 401) {
        // 401 unauthorized response so log user out of client
        //window.location.href = '/';
      }
      return _throw(error._body);
    }
}
