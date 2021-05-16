import { Component, OnInit } from '@angular/core';
import { DynamicScriptLoaderService } from '../../dynamic-script-loader-service.service';
import { DBXHttpService } from '../../core/dbx-http/dbx-http.service';
import { Router, ActivatedRoute } from '@angular/router';
declare const $: any;
declare const Dropzone: any;
import { AuthenticationService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-createtask',
  templateUrl: './createtask.component.html',
  styleUrls: ['./createtask.component.scss']
})
export class CreatetaskComponent implements OnInit {
  selectedTaskItem: any;
  seletedItemTask: any;
  usersData: any = [];
  keyword = 'fullName';
  constructor(private router: Router, private DBXHttp: DBXHttpService, private auth: AuthenticationService) { }

  ngOnInit() {
    this.initBasicSelect();
    this.selectedTaskItem = this.auth.isTaskAppSelected();
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

  selectEventTask(item) { this.seletedItemTask = item; }
  onChangeSearchTask(val: string) { if (val) { this.searchUser(val); } else { this.usersData = []; } }
  clearInputTask(e) { this.seletedItemTask = {}; }
  searchUser(val) {
    // tslint:disable-next-line:max-line-length
    this.DBXHttp.get('DB-task/app/rest/workflow-users?filter=' + val).subscribe((res: any) => {
      this.usersData = res.data;
    });
  }
  onSubmit(form) {
    if (form.value && form.value.name !== '' && form.value.description !== '') {
      const formValue = form.value;
      formValue.assignee = this.seletedItemTask.id;
      formValue.category = this.selectedTaskItem.appDefinitionKey;
      // tslint:disable-next-line:max-line-length
      this.DBXHttp.post('DB-task/app/rest/tasks', formValue).subscribe((res: any) => {
        this.router.navigate(['/task']);
      });
    }
  }
}
