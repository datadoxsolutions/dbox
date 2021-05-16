import { Component, OnInit } from '@angular/core';

import { DynamicScriptLoaderService } from '../../dynamic-script-loader-service.service';
import { ActivatedRoute } from '@angular/router';
import { DBXHttpService } from '../../core/dbx-http/dbx-http.service';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationService } from '../../core/auth/auth.service';
declare const $: any;
declare const Dropzone: any;
declare const swal: any;

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements OnInit {

  accountId: string;
  processList: any = [];
  taskActiveList: any = [];
  taskCompleteList: any = [];
  processInstance: any = [];
  commentList: any = [];
  searchTextString = '';
  currentState = 'running';
  sortOrder = 'created-desc';
  selectedTaskItem: any;
  firstProcessInstance = {id: null};
  paramQueryProcessId = '';
  taskGetParam: any = {
    page: 0,
    state: this.currentState,
    sort: this.sortOrder
  };

  taskActiveGetParam: any = {
    processInstanceId: null,
  };

  taskCompleteGetParam: any = {
    processInstanceId: null,
    state: 'completed'
  };

  commentsParam: any = {
    message: 'Test Message'
  };

  constructor(private route: ActivatedRoute, private DBXHttp: DBXHttpService, private auth: AuthenticationService) { }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedTaskItem = this.auth.isTaskAppSelected();
      this.taskGetParam.appDefinitionKey = this.selectedTaskItem.appDefinitionKey;
      this.fetchProcess();
    });

    this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        console.log(params);
        this.paramQueryProcessId = params.process_id;
      });

    'use strict';
    /* basic select start*/
    $('select').formSelect();
    $('#sel').formSelect();
    var data = [{ id: 1, name: "Option 1" }, { id: 2, name: "Option 2" }, { id: 3, name: "Option 3" }];

    var Options = "";
    $.each(data, function (i, val) {
      $('#sel').append("<option value='" + val.id + '\'>' + val.name + '</option>');
      $('#sel').formSelect();
    });
    /* basic select end*/
    $(function () {
      $('#chat_user').slimscroll({
        height: '590px',
        size: '5px'
      });
    });

    $(function () {
      $('#chat-conversation').slimscroll({
        height: '449px',
        size: '5px'
      });
    });
  }


  showCancelMessage(eventValue) {
    console.log(eventValue);
    var that = this;
    swal({
      title: 'Cancel the process?',
      text: 'Are you sure you want to cancel process "' + eventValue.name + '"',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      closeOnConfirm: false,
      closeOnCancel: false
    // tslint:disable-next-line:only-arrow-functions
    }, function(isConfirm) {
      if (isConfirm) {
        that.deleteProcess(eventValue.id);
      } else {
        swal('Cancelled', 'Your process is safe :)', 'error');
      }
    });
  }

  deleteProcess(instanceId) {
    this.DBXHttp.delete('DB-task/app/rest/process-instances/' + instanceId).subscribe((res: any) => {
      swal('Cancelled!', 'Your process has been cancelled.', 'success');
      this.fetchProcess();
    });
  }

  sortyBy(event) {
    this.taskGetParam.sort = event;
    this.fetchProcess();
  }
  statusChange(event) {
    this.taskGetParam.state = event;
    this.fetchProcess();
  }

  selectedInstance(event) {
    this.processIntance(event.id);
  }

  fetchProcess() {
    this.DBXHttp.post('DB-task/app/rest/query/process-instances', this.taskGetParam).subscribe((res: any) => {
      this.processList = res;
      if (this.processList.total > 0) {
        const firstProcess  = this.processList.data[0];
        this.firstProcessInstance = firstProcess;
        if (this.paramQueryProcessId) {
          this.processIntance(this.paramQueryProcessId);
        } else {
          this.processIntance(firstProcess.id);
        }
      }
    });
  }

  processIntance(instanceId) {
    this.fetchProcessInstance(instanceId);
    this.fetchActiveTask(instanceId);
    this.fetchCompleteTask(instanceId);
    this.fetchComments(instanceId);
  }

  fetchProcessInstance(instanceId) {
    this.DBXHttp.get('DB-task/app/rest/process-instances/' + instanceId).subscribe((res: any) => {
      this.processInstance = res;
    });
  }

  fetchActiveTask(instanceId) {
    this.taskActiveGetParam.processInstanceId = instanceId;
    this.DBXHttp.post('DB-task/app/rest/query/tasks', this.taskActiveGetParam).subscribe((res: any) => {
      this.taskActiveList = res;
    });
  }

  fetchCompleteTask(instanceId) {
    this.taskCompleteGetParam.processInstanceId = instanceId;
    this.DBXHttp.post('DB-task/app/rest/query/tasks', this.taskCompleteGetParam).subscribe((res: any) => {
      this.taskCompleteList = res;
    });
  }

  fetchComments(instanceId) {
    this.DBXHttp.get('DB-task/app/rest/process-instances/' + instanceId + '/comments?latestFirst=true').subscribe((res: any) => {
      this.commentList = res;
    });
  }

  addComment() {
    // tslint:disable-next-line:prefer-const
    let that = this;
    // tslint:disable-next-line:max-line-length
    this.DBXHttp.post('DB-task/app/rest/process-instances/' + this.firstProcessInstance.id + '/comments', this.commentsParam).subscribe((res: any) => {
      console.log(res);
      this.fetchComments(that.firstProcessInstance.id);
    });
  }

}
