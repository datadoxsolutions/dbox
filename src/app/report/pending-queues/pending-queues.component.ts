import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DynamicScriptLoaderService } from '../../dynamic-script-loader-service.service';
declare const $: any;
@Component({
  selector: 'app-pending-queues',
  templateUrl: './pending-queues.component.html',
  styleUrls: ['./pending-queues.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PendingQueuesComponent implements OnInit {
  // data = [{
  //     invoice_number :  'I70808',
  //     ap_stage :  'Duplicate Check',
  //     pending_with : 'checker' ,
  //     task_started_at : '2019-07-27 10:42:30.000'
  // },
  // {
  //     invoice_number :  '123',
  //     ap_stage :  'Duplicate Check',
  //     pending_with : 'checker' ,
  //     task_started_at : '2019-07-27 10:12:52.000'
  // }];
  data = [];
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService) {}
  ngOnInit() {
    var that = this;
    setTimeout(function() {
      that.startScript();
    }, 1000);
  }

  async startScript() {
    // tslint:disable-next-line:max-line-length
    await this.dynamicScriptLoader.load('dataTables.buttons', 'buttons.flash', 'jszip', 'pdfmake', 'vfs_fonts', 'pdfmake', 'buttons.html5', 'buttons.print').then( data => {
      this.loadData();
    }).catch(error => console.log(error));
  }

  private loadData() {
    $('#tableExport').DataTable({
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ]
    });
  }

}
