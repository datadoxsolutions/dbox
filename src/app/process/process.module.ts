import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArchwizardModule } from 'angular-archwizard';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { ProcessRoutingModule } from './process-routing.module';
import { ProcessComponent } from './process/process.component';
import { StartprocessComponent } from './startprocess/startprocess.component';
import { SharedModule } from './../core/shared/shared.module';
@NgModule({
  declarations: [ProcessComponent, StartprocessComponent],
  imports: [
    CommonModule,
    ProcessRoutingModule,
    FormsModule,
    ArchwizardModule,
    DropzoneModule,
    SharedModule
  ]
})
export class ProcessModule { }
