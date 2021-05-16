import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DBXHttpService } from '../../core/dbx-http/dbx-http.service';
import { map, catchError } from 'rxjs/operators';
import * as moment from 'moment';
import { AuthenticationService } from '../../core/auth/auth.service';
import { _ } from 'underscore';
import { NavService } from 'src/app/core/services/nav.service';
declare const $: any;
declare const Dropzone: any;
declare const swal: any;

@Component({
  selector: 'app-startprocess',
  templateUrl: './startprocess.component.html',
  styleUrls: ['./startprocess.component.scss']
})
export class StartprocessComponent implements OnInit {
  selectedTaskItem: any;
  processList: any = [];
  processInstance: any = [];
  currentDate = moment().format('MMMM Do YYYY');
  constructor(private router: Router, private route: ActivatedRoute, private DBXHttp: DBXHttpService, private auth: AuthenticationService, private navService:NavService) {
    this.selectedTaskItem = this.auth.isTaskAppSelected();
    this.route.queryParams.subscribe(params => {
      this.fetchProcessInstance(params.processId);
    });
  }

  ngOnInit() {
    this.fetchProcesses();
  }

  fetchProcesses() {
    // tslint:disable-next-line:prefer-const
    let that = this;
    // tslint:disable-next-line:max-line-length
    this.DBXHttp.get('DB-task/app/rest/process-definitions?latest=true&appDefinitionKey=' + this.selectedTaskItem.appDefinitionKey).subscribe((res: any) => {
      that.processList = res;
      console.log(that.processList, that.processInstance);
      if(_.isEmpty(that.processInstance)) {
        console.log(that.processList['data'][0]);
        this.processInstance = that.processList['data'][0];
      }
    });
  }

  fetchProcessInstance(processId) {
    this.DBXHttp.get('DB-task/app/rest/process-instances/' + processId).subscribe((res: any) => {
      this.processInstance = res;
    });
  }

  startProcess() {
    const name = (this.processInstance.processDefinitionName || this.processInstance.name)  + '-' +  this.currentDate;
    const processId = this.processInstance.processDefinitionId || this.processInstance.id;
    // tslint:disable-next-line:max-line-length
    this.DBXHttp.post('DB-task/app/rest/process-instances', {processDefinitionId: processId, name}).subscribe((res: any) => {
      this.navService.emitNavChangeEvent(true);
      this.router.navigate(['/process/index']);
    });
  }

}
