import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DBXHttpService } from '../../../core/dbx-http/dbx-http.service';
import { DynamicScriptLoaderService } from '../../../dynamic-script-loader-service.service';
declare const $: any;
declare const Dropzone: any;
import { environment } from '../../../../environments/environment';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { NavService } from 'src/app/core/services/nav.service';
@Component({
  selector: 'app-taskdetails',
  templateUrl: './taskdetails.component.html',
  styleUrls: ['./taskdetails.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskdetailsComponent implements OnInit {
  @Input() subTaskLists = [];
  @Input() commentDetails = [];
  @Input() involvePeopleList = [];
  @Input() contentData = {};
  @Input() taskId;
  @Input() processInstanceId;
  @Output() refreshComments: EventEmitter<any> = new EventEmitter();
  @Output() refreshSubTask: EventEmitter<any> = new EventEmitter();
  @Output() refreshTask: EventEmitter<any> = new EventEmitter();
  @Output() contentRefresh: EventEmitter<any> = new EventEmitter();
  @Output() taskRefresh: EventEmitter<any> = new EventEmitter();
  @Output() deleteContent: EventEmitter<any> = new EventEmitter();
  uploader: FileUploader;
  response: string;
  urldownload: any;
  seletedItem: any = {};
  seletedItemTask: any = {};
  usersData = [];
  keyword = 'fullName';
  isShow = false;
  commentMsg = null;
  constructor(public router: Router, private DBXHttp: DBXHttpService, private navService: NavService) { }
  ngOnInit() {
    $('.collapsible').collapsible();
    this.initBasicSelect();
    this.urldownload = environment.api_endpoint;
    this.initUPloader();
  }
  cancel() {
    this.isShow = !this.isShow;
    this.commentMsg = null;
  }

  submitSubTask(subTask) {
    if (subTask.value && this.seletedItemTask) {
      const formData = Object.assign(subTask.value, {assignee: this.seletedItemTask.id, parentTaskId: this.taskId});
      // tslint:disable-next-line:max-line-length
      this.DBXHttp.post('DB-task/app/rest/tasks', formData).subscribe((res: any) => {
        console.log(res);
        this.refreshSubTask.emit('refreshTask');
        $('#sub_task .cancel').click();
        subTask.reset();
        this.seletedItemTask = {};
      });
    }
  }

  submitComment() {
    if (this.commentMsg !== null) {
      // tslint:disable-next-line:max-line-length
      this.DBXHttp.post('DB-task/app/rest/tasks/' + this.taskId + '/comments', { message: this.commentMsg }).subscribe((res: any) => {
        this.refreshComments.emit('refreshComment');
        this.cancel();
      });
    }
  }

  private initBasicSelect() {
    /* basic select start*/
    $('select').formSelect();
    $('#sel').formSelect();
    var data = [{ id: 1, name: "Option 1" }, { id: 2, name: "Option 2" }, { id: 3, name: "Option 3" }];

    var Options = "";
    $.each(data, function (i, val) {
      $('#sel').append("<option value='" + val.id + "'>" + val.name + "</option>");
      $('#sel').formSelect();
    });
    /* basic select end*/
  }

  // involve people
  selectEvent(item) { this.seletedItem = item; this.assignUser(); }
  onChangeSearch(val: string) { if (val) { this.searchUser(val); } else { this.usersData = []; } }
  clearInput(e) { this.seletedItem = {}; }

  selectEventTask(item) { this.seletedItemTask = item; }
  onChangeSearchTask(val: string) { if (val) { this.searchUser(val); } else { this.usersData = []; } }
  clearInputTask(e) { this.seletedItemTask = {}; }

  searchUser(val) {
    // tslint:disable-next-line:max-line-length
    //excludeTaskId=' + this.taskId + '&
    this.DBXHttp.get('DB-task/app/rest/workflow-users?filter=' + val).subscribe((res: any) => {
      this.usersData = res.data;
    });
  }

  assignUser() {
    if (this.seletedItem) {
      // tslint:disable-next-line:max-line-length
      this.DBXHttp.put('DB-task/app/rest/tasks/' + this.taskId + '/action/involve', { userId: this.seletedItem.id }).subscribe((res: any) => {
        this.refreshTask.emit('refreshTask');
        $('#select_person .cancel').click();
        this.seletedItem = {};
      });
    }
  }

  removeUser(people) {
    console.log(people);
    // tslint:disable-next-line: max-line-length
    this.DBXHttp.put('DB-task/app/rest/tasks/' + this.taskId + '/action/remove-involved', { userId: people.id }).subscribe((res: any) => {
      this.refreshTask.emit('refreshTask');
    });
  }

  // action/remove-involved

  public onFileSelected(event: EventEmitter<File[]>) {
    const file: File = event[0];
    this.uploader.uploadAll();
  }

  clearContent(contentId) {
    this.deleteContent.emit(contentId);
  }

  initUPloader() {
    // tslint:disable-next-line:max-line-length
    this.uploader = new FileUploader({url: environment.api_endpoint + 'DB-task/app/rest/process-instances/' + this.processInstanceId + '/raw-content'});
    var that = this;
    this.uploader.onCompleteItem = (item: FileItem, response, status, header) => {
      if (status === 200) {
        that.contentRefresh.emit(that.processInstanceId);
        $('#related_content .cancel').click();
      }
    };
  }




}
