
import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { DBXHttpService } from './../../dbx-http/dbx-http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { _ } from 'underscore';
declare const $: any;
declare const swal: any;

@Component({
  selector: 'app-process-case-template',
  templateUrl: './process-case-template.component.html',
  styleUrls: ['./process-case-template.component.scss']
})
export class ProcessCaseTemplateComponent implements OnInit, OnChanges {
  isShow = false;
  @Input() title: any = 'Processes';
  @Input() processList: any = [];
  @Input() processInstance: any = [];
  @Input() taskActiveList: any = [];
  @Input() taskCompleteList: any = [];
  @Input() commentList: any = [];
  commentMsg: string;
  currentStatus = 'running';
  selected: any = {};
  paramQueryProcessId = '';
  env = environment;
  @Output() commentRefresh: EventEmitter<any> = new EventEmitter();
  @Output() processCase: EventEmitter<any> = new EventEmitter();
  @Output() sortyBy: EventEmitter<any> = new EventEmitter();
  @Output() status: EventEmitter<any> = new EventEmitter();
  @Output() cancelEnstance: EventEmitter<any> = new EventEmitter();

  constructor(private DBXHttp: DBXHttpService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.paramQueryProcessId = params.process_id;
      });

    this.toolTip();
    'use strict';

    $('select').formSelect();
    $('#sel').formSelect();
    var data = [{ id: 1, name: "Option 1" }, { id: 2, name: "Option 2" }, { id: 3, name: "Option 3" }];
    
    $(function () {
      $('#chat_user').slimscroll({
        height: '590px',
        size: '5px'
      });
    });

    $(function() {
      $('#chat-conversation').slimscroll({
        height: '449px',
        size: '5px'
      });
    });

    // tslint:disable-next-line:only-arrow-functions
    $(function() {
      $('.js-sweetalert button').on('click', function () {
        var type = $(this).data('type');
        if (type === 'cancel') {
          showCancelMessage();
        }
      });
    });

    function showCancelMessage() {
      swal({
        title: 'Are you sure?',
        text: 'You will not be able to recover this imaginary file!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel plx!',
        closeOnConfirm: false,
        closeOnCancel: false
      // tslint:disable-next-line:only-arrow-functions
      }, function(isConfirm) {
        if (isConfirm) {
          swal('Deleted!', 'Your imaginary file has been deleted.', 'success');
        } else {
          swal('Cancelled', 'Your imaginary file is safe :)', 'error');
        }
      });
    }
  }

  private toolTip() {
    $('[data-toggle="tooltip"]').tooltip({container: 'body', html: true});
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.processList) {
      if (changes.processList.currentValue.data) {
        if (this.paramQueryProcessId) {
          this.selected = _.findWhere(changes.processList.currentValue.data, {id: this.paramQueryProcessId});
        } else {
          this.selected = changes.processList.currentValue.data[0];
        }
      }
    }
  }

  cancel() {
    this.isShow = !this.isShow;
    this.commentMsg = null;
  }

  onCancel() {
    this.cancelEnstance.emit(this.selected);
  }

  onProcess(item) {
    this.selected = item;
    this.processCase.emit(item);
  }

  sortBy(event) {
    this.sortyBy.emit(event.target.value);
  }

  stateChange(value) {
    this.currentStatus = value;
    this.status.emit(this.currentStatus);
  }

  submitComment() {
    if (this.commentMsg !== null) {
      // tslint:disable-next-line:max-line-length
      this.DBXHttp.post('DB-task/app/rest/process-instances/' + this.processInstance.id + '/comments', {message: this.commentMsg}).subscribe((res: any) => {
        console.log(res);
        this.commentRefresh.emit(this.processInstance.id);
        this.cancel();
      });
    }
  }

  redirectTask(act) {
    console.log(act);
    this.router.navigate(['/task/' + act.assignee.id]);
  }

}
