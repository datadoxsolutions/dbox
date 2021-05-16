import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DynamicScriptLoaderService } from '../../dynamic-script-loader-service.service';
declare const $: any;
@Component({
  selector: 'app-completed-invoices',
  templateUrl: './completed-invoices.component.html',
  styleUrls: ['./completed-invoices.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CompletedInvoicesComponent implements OnInit {
  // data = [{
  //   invoice_number :  'I08080',
  //   PONo :  'P0987',
  //   vendor_name : 'veernet' ,
  //   invoice_amount: '60',
  //   invoice_date : '2019-06-27',
  //   task_date : '2019-07-27',
  //   approval_amount: '60',
  //   payment_reference: 'px9797',
  //   payment_complete: 'yes'
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
