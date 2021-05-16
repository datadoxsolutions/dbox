import { Component, OnInit } from '@angular/core';
import { DynamicScriptLoaderService } from '../../dynamic-script-loader-service.service';
import { map, catchError } from 'rxjs/operators';
declare const $: any;
declare const Dropzone: any;
import { ActivatedRoute } from '@angular/router';
import { DBXHttpService } from '../../core/dbx-http/dbx-http.service';
import { _ } from 'underscore';
import { AuthenticationService } from '../../core/auth/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { NavService } from 'src/app/core/services/nav.service';
@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  accountId: string;
  userTaskList: any = [];
  userQueueList: any = [];
  searchTextString = '';
  currentState = 'open';
  selectedTaskItem: any;
  taskGetParam: any = {
    page: 0,
    state: this.currentState,
    assignment: 'involved',
    sort: 'created-desc'};
  // tslint:disable-next-line:max-line-length
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService,  private route: ActivatedRoute, private DBXHttp: DBXHttpService, private auth: AuthenticationService,  private notify: NotificationService, private navService: NavService) { }
  ngOnInit() {
    'use strict';
    this.initBasicSelect();
    this.selectedTaskItem = this.auth.isTaskAppSelected();
    this.taskGetParam.appDefinitionKey = this.selectedTaskItem.appDefinitionKey;

    this.route.params.subscribe( params => {
      this.accountId = params.account_id;
      if (this.accountId !== 'task') {
        this.taskGetParam.assignee = this.accountId;
      }
      this.fetchTask();
    });
  }

  fetchTask() {
    this.userTaskList = [];
    this.DBXHttp.post('DB-task/app/rest/query/tasks', this.taskGetParam).subscribe((res: any) => {
      console.log(res);
      this.userTaskList = res;
      if (this.accountId !== 'task') {
        this.userTaskList.data = _.where(this.userTaskList.data, {name: this.accountId});
        this.getData();
      }
      this.navService.emitNavChangeEvent(true);
    });
  }

  getData() {
    this.userTaskList.data.forEach((element, index) => {
      var that = this;
      this.DBXHttp.get('DB-task/app/rest/task-forms/' + element.id).subscribe((res: any) => {
        let workIdObject = _.findWhere(res.fields, {id: 'workunitid'});
        if(this.selectedTaskItem.appDefinitionKey === 'caseApp') {
          workIdObject = _.findWhere(res.fields, {id: 'caseno'});
        }
        that.userTaskList.data[index].workId = workIdObject.value;
      });
    });
    this.userQueueList = this.userTaskList.data;
    this.userQueueList = this.userQueueList.filter(function(obj: any) {
      if (obj.workId) {
        return obj.workId.indexOf(this.searchTextString) !== -1;
      } else {
        return true;
      }
    });
  }

  getIsClaimExist() {
    var valueisExist = [];
    this.userTaskList.data.forEach(element => {
      if (_.isEmpty(element.assignee)) {
        valueisExist.push('test');
      }
    });
    console.log(valueisExist);
    return valueisExist.length > 0;
  }

  submitClaim(taskId) {
    this.DBXHttp.put('DB-task/app/rest/tasks/' + taskId + '/action/claim', {}).subscribe((res: any) => {
      this.notify.showSuccess('Task has been claim successfully');
      this.fetchTask();
    });
  }

  private initBasicSelect() {
    /* basic select start*/
    $('select').formSelect();
    $('#sel').formSelect();
    const data: any = [{ id: 1, name: 'Option 1' }, { id: 2, name: 'Option 2' }, { id: 3, name: 'Option 3' }];
    $.each(data, function (i, val) {
      $('#sel').append('<option value=\'' + val.id + '\'>' + val.name + '</option>');
      $('#sel').formSelect();
    });
    /* basic select end*/
  }

  changeStatus(event) {
    this.taskGetParam.state = event.target.checked ? 'completed' : 'open';
    this.fetchTask();
  }

  selectedOrder(event) {
    this.taskGetParam.sort = event.target.value;
    this.fetchTask();
  }
  searchText(event) {
    // tslint:disable-next-line: only-arrow-functions
    this.userQueueList = this.userTaskList.data;
    this.userQueueList = this.userQueueList.filter(function(obj: any) {
      return obj.workId.indexOf(event.target.value) !== -1;
    });
    this.searchTextString = event.target.value;
    // this.taskGetParam.text = this.searchTextString;
    // this.fetchTask();
  }
}
