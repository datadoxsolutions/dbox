import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcessCaseTemplateComponent } from './process-case-template/process-case-template.component';
import { DbPipesModule } from '../pipes/pipes.modules';
import { RouterModule, Routes } from '@angular/router';
import { NotificationService } from '../services/notification.service';
@NgModule({
  declarations: [ProcessCaseTemplateComponent],
  exports: [ProcessCaseTemplateComponent, DbPipesModule],
  imports: [
    CommonModule,
    DbPipesModule,
    FormsModule,
    RouterModule
  ],
  providers: [NotificationService],
})
export class SharedModule { }
