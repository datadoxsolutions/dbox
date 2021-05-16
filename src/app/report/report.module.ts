import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArchwizardModule } from 'angular-archwizard';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { ReportRoutingModule } from './report-routing.module';
import { CompletedInvoicesComponent } from './completed-invoices/completed-invoices.component';
import { PaymentAgeingReportComponent } from './payment-ageing-report/payment-ageing-report.component';
import { PendingQueuesComponent } from './pending-queues/pending-queues.component';
import { SharedModule } from './../core/shared/shared.module';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { ToastrModule } from 'ngx-toastr';
@NgModule({
  declarations: [CompletedInvoicesComponent, PaymentAgeingReportComponent, PendingQueuesComponent],
  imports: [
    ReportRoutingModule,
    FormsModule,
    ArchwizardModule,
    DropzoneModule,
    SharedModule,
    AutocompleteLibModule,
    ToastrModule
  ]
})
export class ReportModule { }
