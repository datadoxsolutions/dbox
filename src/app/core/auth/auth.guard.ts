import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    public router: Router
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // tslint:disable-next-line:no-unused-expression
    if (!this.authService.isUserLogin()) {
      window.location.href =  environment.appBaseUrl+'/authentication/signin';
      // document.location.reload(true);
    }
    // && this.router.navigate(['authentication/signin']);
    return this.authService.isUserLogin();
  }
}
