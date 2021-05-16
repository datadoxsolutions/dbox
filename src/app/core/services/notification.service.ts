import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class NotificationService {
  constructor(private toastr: ToastrService) {  }

  showSuccess(text) {
    console.log(text);
    this.toastr.success(text, null, { positionClass: 'toast-bottom-center'});
  }

  showError(text) {
    console.log(text);
    this.toastr.error(text, null, { positionClass: 'toast-bottom-center'});
  }
}
