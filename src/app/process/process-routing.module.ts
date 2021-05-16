import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './../core/auth/auth.guard';
import { ProcessComponent } from './process/process.component';
import { StartprocessComponent } from './startprocess/startprocess.component';
const routes: Routes = [
    {
      path: '',
      redirectTo: 'index',
      pathMatch: 'full'
    },
    {
      path: 'index',
      component: ProcessComponent
    },
    {
      path: 'startprocess',
      component: StartprocessComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProcessRoutingModule { }
