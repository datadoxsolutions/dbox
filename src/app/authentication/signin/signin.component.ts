import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/auth/auth.service';
import { Observable } from 'rxjs/Observable';
declare const jQuery: any;
import { ConnectionBackend, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { DBXHttpService } from '../../core/dbx-http/dbx-http.service';
import { NotificationService } from '../../core/services/notification.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

    constructor(private auth: AuthenticationService, private DBXHttp: DBXHttpService, private notify: NotificationService) { }

    ngOnInit() {
      this.logoutApp();
      (function ($) {
        "use strict";


        /*==================================================================
        [ Focus input ]*/
        $('.input100').each(function () {
          $(this).on('blur', function () {
            if ($(this).val().trim() != "") {
              $(this).addClass('has-val');
            }
            else {
              $(this).removeClass('has-val');
            }
          })
        })


        /*==================================================================
        [ Validate ]*/
        var input = $('.validate-input .input100');

        $('.validate-form').on('submit', function () {
          var check = true;

          for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
              showValidate(input[i]);
              check = false;
            }
          }

          return check;
        });


        $('.validate-form .input100').each(function () {
          $(this).focus(function () {
            hideValidate(this);
          });
        });

        function validate(input) {
          if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
              return false;
            }
          }
          else {
            if ($(input).val().trim() == '') {
              return false;
            }
          }
        }

        function showValidate(input) {
          var thisAlert = $(input).parent();

          $(thisAlert).addClass('alert-validate');
          $(".erroe_dis").remove();
          $(".alert-validate").append('<i class="material-icons erroe_dis">error</i>');
        }

        function hideValidate(input) {
          var thisAlert = $(input).parent();

          $(thisAlert).removeClass('alert-validate');
          $(".erroe_dis").remove();
        }

        /*==================================================================
        [ Show pass ]*/
        var showPass = 0;
        $('.btn-show-pass').on('click', function () {
          if (showPass == 0) {
            $(this).next('input').attr('type', 'text');
            $(this).addClass('active');
            showPass = 1;
          }
          else {
            $(this).next('input').attr('type', 'password');
            $(this).removeClass('active');
            showPass = 0;
          }

        });


      })(jQuery);
    }

  signIn(formValue) {
    this.auth.login(formValue.user, formValue.pass).subscribe(
      (res: any) => {
        this.authenticateUser();
      }, error => {
        const errorHandle = JSON.parse(error);
        if (errorHandle.status === 401) {
          this.notify.showError('Invalid Username or password, Please retry with correct username and password');
        } else {
          this.notify.showError(errorHandle.message);
        }
      }
    );
  }

  authenticateUser() {
    this.auth.setAuthenticateUser()
    .map((response: Response) => response.json())
    .subscribe(
      (res: any) => {
        this.test();
        localStorage.setItem('userLoginIn', 'true');
        window.location.href =  environment.appBaseUrl+'/dashboard/defination';
      }, error => {
        const errorHandle = JSON.parse(error);
        this.notify.showError(errorHandle.message);
      }
    );
  }

  test() {
    console.log(document.cookie);
    var pairs = document.cookie.split(";");
    console.log(pairs);
  }

  logoutApp() {
    this.DBXHttp.get('DB-task/app/logout').subscribe((res: any) => {
      localStorage.removeItem('userLoginIn');
      localStorage.removeItem('seletedApp');
      window.location.href =  environment.appBaseUrl+'/authentication/signin';
    });
  }

}
