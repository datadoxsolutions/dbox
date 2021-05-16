import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskComponent } from './task/task.component';
import { TasksingleComponent } from './tasksingle/tasksingle.component';
import { CreatetaskComponent } from './createtask/createtask.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'task',
    pathMatch: 'full'
  },
  {
    path: ':account_id/:task_id',
    component: TasksingleComponent
  },
  {
    path: 'createtask',
    component: CreatetaskComponent
  },
  {
    path: ':account_id',
    component: TaskComponent
  }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
