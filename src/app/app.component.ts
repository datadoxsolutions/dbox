import { Component, HostListener } from '@angular/core';
import { Event, Router, NavigationStart, NavigationEnd, RouterEvent } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { DBXHttpService } from './core/dbx-http/dbx-http.service';
import { AuthenticationService } from './core/auth/auth.service';
import { Observable, zip, zip as observableZip } from 'rxjs';
import { environment } from '../environments/environment';
import { _ } from 'underscore';
import { NavService } from './core/services/nav.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentUrl: string;
  showLoadingIndicatior = true;
  userAccount: any = {};
  listOfApps: any = [];
  listOfQueue: any = [];
  selectedTaskItem: any = {};
  secondLast: any = '';
  version: any;
  topManuActive: any = false;
  queueSubscription: any;
  listCountMenu = {};
  taskGetParamC: any = { state: 'completed', assignment: 'involved', sort: 'created-desc' };
  taskGetParamO: any = { state: 'open', assignment: 'involved', sort: 'created-desc' };
  // tslint:disable-next-line:variable-name
  // tslint:disable-next-line: max-line-length
  constructor(private _router: Router, location: PlatformLocation, private DBXHttp: DBXHttpService, private auth: AuthenticationService, private navService: NavService) {
    this.selectedTaskItem = this.auth.isTaskAppSelected();
    this.taskGetParamC.appDefinitionKey = this.selectedTaskItem.appDefinitionKey;
    this.taskGetParamO.appDefinitionKey = this.selectedTaskItem.appDefinitionKey;
    this.version = environment.version;
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log(event);
        if (this._router.url === '/') {
          this._router.navigate(['dashboard/defination']);
        }
      }
    });

    this._router.events.subscribe((routerEvent: Event) => {

      if (routerEvent instanceof NavigationStart) {
        this.showLoadingIndicatior = true;
        location.onPopState(() => {
          window.location.reload();
        });
       // var secondLastIndex = url.lastIndexOf('/', url.lastIndexOf('/')-1)
        this.secondLast = routerEvent.url.substring(routerEvent.url.lastIndexOf('/', routerEvent.url.lastIndexOf('/') - 1));
        this.currentUrl = routerEvent.url.substring(routerEvent.url.lastIndexOf('/') + 1);
        console.log(this.currentUrl);
      }

      // tslint:disable-next-line:max-line-length
      if (this.currentUrl.trim() === 'signin' || this.currentUrl.trim() === 'signup' || this.currentUrl.trim() === 'forgot-password' || this.currentUrl.trim() === 'locked' || this.currentUrl.trim() === 'page404' || this.currentUrl.trim() === 'page500') {
        // tslint:disable-next-line:no-string-literal
        document.getElementById('main-component').style['display'] = 'none';
      } else {
        document.getElementById('main-component').style.removeProperty('display');
      }

      if (this.currentUrl === 'process' || this.currentUrl === 'index' || this.currentUrl === 'main') {
        this.topManuActive = false;
      }
      if (routerEvent instanceof NavigationEnd) {
        this.showLoadingIndicatior = false;
      }
      window.scrollTo(0, 0);
    });
    this.DBXHttp.get('DB-task/app/rest/account').subscribe((res: any) => {
      console.log(res);
      this.userAccount = res;
    });

    this.DBXHttp.get('DB-task/app/rest/runtime/app-definitions').subscribe((res: any) => {
      this.listOfApps = res.data;
      // tslint:disable-next-line:only-arrow-functions
      this.listOfApps = _.map(this.listOfApps, function(item) {
        item.selected = false;
        item.icon = 'settings_backup_restore';
        if (item.appDefinitionKey === 'APP1') {
          item.selected = true;
          item.icon = 'query_builder';
          if (!localStorage.getItem('seletedApp')) {
            this.selectApp(item);
          }
        }
        return item;
      });
      this.selectedTaskItem = this.auth.isTaskAppSelected();
    });
    this.getQueue();
    this.queueSubscription = this.navService.getNavChangeEmitter().subscribe(item => {
      this.getQueue();
      console.log("test");
    });
  }

  getQueue() {
    zip(
      this.DBXHttp.post('DB-task/app/rest/query/tasks', this.taskGetParamC),
      this.DBXHttp.post('DB-task/app/rest/query/tasks', this.taskGetParamO)
    ).subscribe(([complatedTask, openTask]) => {
      console.log(complatedTask, openTask);
      // tslint:disable-next-line:no-string-literal
      this.findTaskQueue(complatedTask['data'], openTask['data']);
    });
  }

  findTaskQueue(complatedTask, openTask) {
    const combinedData = complatedTask.concat(openTask);
    let listOfQueue = _.uniq(_.pluck(combinedData, 'name'));
    console.log(listOfQueue);
    var sortingData = ['Indexer', 'Duplicate  Check', 'Matching Process', 'Validation', 'Duplicate Exception', 'Match Exception', 'Approver1', 'Approver2', 'Approval1', 'Approval2', 'Payment'];
    let listOfQueueData = sortingData.map(function(value, index) {
      console.log(listOfQueue.indexOf(sortingData[index]));
      if (listOfQueue.indexOf(value) !== -1 ) {
        return sortingData[index];
      }
    });
    var datad = _.filter(listOfQueueData, function(v) { return !_.isUndefined(v)});
    var inter = _.difference(listOfQueue, datad);
    const final = datad.concat(inter);
    this.listOfQueue = _.uniq(final);

    let CounObj = {};
    openTask.forEach(element => {
      CounObj[element.name] = CounObj[element.name] ? CounObj[element.name] + 1 : 1;
    });
    this.listCountMenu = CounObj;

    localStorage.setItem('listofqueue', JSON.stringify(this.listOfQueue));
  }

  selectApp(item) {
    localStorage.setItem('seletedApp', JSON.stringify(item));
    window.location.href = environment.appBaseUrl+'/dashboard/main';
  }

  checkIndexOf(text) {
    let textSplit = text.split(' ');
    if (this.secondLast.indexOf(textSplit[0]) >= 0) {
      this.topManuActive = true;
      return true;
    } else {
      return false;
    }
  }

  logoutApp() {
    this.DBXHttp.get('DB-task/app/logout').subscribe((res: any) => {
      localStorage.removeItem('userLoginIn');
      localStorage.removeItem('seletedApp');
      window.location.href =  environment.appBaseUrl+'/authentication/signin';
    }, error => {
      localStorage.removeItem('userLoginIn');
      localStorage.removeItem('seletedApp');
      window.location.href =  environment.appBaseUrl+'/authentication/signin';
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.log(event);
  }

}
