import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompletedInvoicesComponent } from './completed-invoices/completed-invoices.component';
import { PaymentAgeingReportComponent } from './payment-ageing-report/payment-ageing-report.component';
import { PendingQueuesComponent } from './pending-queues/pending-queues.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pending-queues',
    pathMatch: 'full'
  },
  {
    path: 'pending-queues',
    component: PendingQueuesComponent
  },
  {
    path: 'payment-ageing-report',
    component: PaymentAgeingReportComponent
  },
  {
    path: 'completed-invoices',
    component: CompletedInvoicesComponent
  }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
