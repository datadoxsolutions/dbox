import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArchwizardModule } from 'angular-archwizard';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { TaskRoutingModule } from './task-routing.module';
import { TaskComponent } from './task/task.component';
import { TasksingleComponent } from './tasksingle/tasksingle.component';
import { TaskdetailsComponent } from './tasksingle/taskdetails/taskdetails.component';
import { SharedModule } from './../core/shared/shared.module';
import { CreatetaskComponent } from './createtask/createtask.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { FileUploadModule } from 'ng2-file-upload';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ToastrModule } from 'ngx-toastr';
@NgModule({
  declarations: [TaskComponent, TasksingleComponent, TaskdetailsComponent, CreatetaskComponent],
  imports: [
    TaskRoutingModule,
    FormsModule,
    ArchwizardModule,
    DropzoneModule,
    SharedModule,
    AutocompleteLibModule,
    FileUploadModule,
    PdfViewerModule,
    ToastrModule
  ]
})
export class TaskModule { }
