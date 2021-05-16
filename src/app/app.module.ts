//import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WidgetComponent } from './widget/widget.component';
import { LocationStrategy, PathLocationStrategy, CommonModule} from '@angular/common';
import { DynamicScriptLoaderService } from './dynamic-script-loader-service.service';
import { AuthenticationService } from './core/auth/auth.service';
import { AuthGuard } from './core/auth/auth.guard';
import { DBXHttpService } from './core/dbx-http/dbx-http.service';
import { SharedModule } from './core/shared/shared.module';
import { CasesComponent } from './cases/cases.component';
import { CaseComponent } from './case/case.component';
import { TooltipModule } from 'ngx-tooltip';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { NavService } from './core/services/nav.service';
@NgModule({
  declarations: [
    AppComponent,
    WidgetComponent,
    CasesComponent,
    CaseComponent
  ],
  imports: [
    AppRoutingModule,
    SharedModule,
    HttpModule,
    TooltipModule,
    AutocompleteLibModule,
    BrowserAnimationsModule,
    CommonModule,
    ToastrModule.forRoot({timeOut: 3000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }) // ToastrModule added
  ],
  // tslint:disable-next-line:max-line-length
  providers: [{provide: LocationStrategy, useClass: PathLocationStrategy}, DynamicScriptLoaderService, AuthenticationService, AuthGuard, DBXHttpService, CookieService, NavService],
  bootstrap: [AppComponent]
})
export class AppModule { }
