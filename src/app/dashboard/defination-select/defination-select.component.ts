import { Component, OnInit } from '@angular/core';
import { DynamicScriptLoaderService } from '../../dynamic-script-loader-service.service';
import { DBXHttpService } from '../../core/dbx-http/dbx-http.service';
import { AuthenticationService } from '../../core/auth/auth.service';
import { Event, Router, NavigationStart, NavigationEnd, RouterEvent } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { _ } from 'underscore';
import { environment } from '../../../environments/environment';

declare const $: any;
declare const Chart: any;
declare const echarts: any;
declare const window: any;


@Component({
  selector: 'app-defination',
  templateUrl: './defination-select.component.html',
  styleUrls: ['./defination-select.component.scss']
})
export class DefinationSelectComponent implements OnInit {
  listOfApps = [];
  // tslint:disable-next-line:max-line-length
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private DBXHttp: DBXHttpService, private auth: AuthenticationService) { }

  ngOnInit() {
    this.DBXHttp.get('DB-task/app/rest/runtime/app-definitions').subscribe((res: any) => {
      this.listOfApps = res.data;
      // tslint:disable-next-line:prefer-const
      // tslint:disable-next-line:max-line-length
      let colorClass = ['l-bg-red', 'l-bg-cyan', 'l-bg-orange', 'l-bg-purple', 'l-bg-cyan', 'l-bg-orange', 'l-bg-orange', 'l-bg-purple', 'l-bg-cyan', 'l-bg-orange', 'l-bg-cyan', 'l-bg-orange'];
      // tslint:disable-next-line:only-arrow-functions
      this.listOfApps = _.map(this.listOfApps, function(item, index) {
        item.selected = false;
        item.icon = 'settings_backup_restore';
        item.color = colorClass[index];
        if (item.appDefinitionKey === 'APP1') {
          item.selected = true;
          item.icon = 'query_builder';
          item.color = colorClass[index];
        }
        return item;
      });

      console.log(this.listOfApps);
    });
  }

  selectApp(item) {
    localStorage.setItem('seletedApp', JSON.stringify(item));
    window.location.href =  environment.appBaseUrl+'/dashboard/main';
  }

}
