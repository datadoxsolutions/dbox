import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DynamicScriptLoaderService } from '../../dynamic-script-loader-service.service';
declare const $: any;
@Component({
  selector: 'app-payment-ageing-report',
  templateUrl: './payment-ageing-report.component.html',
  styleUrls: ['./payment-ageing-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentAgeingReportComponent implements OnInit {
  // data = [{
  //     invoice_number :  'I70808',
  //     PONo :  'P001',
  //     vendor_name : 'intel' ,
  //     invoice_date : '2019-06-27',
  //     task_date : '2019-07-27'
  // }];
  data = [];
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService) {}

  ngOnInit() {
    this.startScript();
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
