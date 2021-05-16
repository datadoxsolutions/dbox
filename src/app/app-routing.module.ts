import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { CasesComponent } from './cases/cases.component';
const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'task',
        loadChildren: './task/task.module#TaskModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'report',
        loadChildren: './report/report.module#ReportModule',
        canActivate: [AuthGuard]
    },
    {
      path: 'cases',
      component: CasesComponent,
      canActivate: [AuthGuard]
    },
    {
        path: 'process',
        loadChildren: './process/process.module#ProcessModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'authentication',
        loadChildren: './authentication/authentication.module#AuthenticationModule'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
