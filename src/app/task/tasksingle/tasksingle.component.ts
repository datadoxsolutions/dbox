import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { DynamicScriptLoaderService } from '../../dynamic-script-loader-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ConnectionBackend, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DBXHttpService } from '../../core/dbx-http/dbx-http.service';
import * as moment from 'moment';
declare const $: any;
declare const Dropzone: any;
import data from './sample.json';
import { _ } from 'underscore';
import { NgForm } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { NotificationService } from '../../core/services/notification.service';
import * as Tesseract from 'tesseract.js';
import { NavService } from 'src/app/core/services/nav.service';
declare const swal: any;


export class CustomPixel {
  x: any;
  y: any;
}

export class CustomRect {
  x0: any;
  y0: any;
  x1: any;
  y1: any;
}



function readBase64(file): Promise<any> {
  let reader  = new FileReader();
  let future = new Promise((resolve, reject) => {
    reader.addEventListener('load', function() {
      resolve(reader.result);
    }, false);

    reader.addEventListener('error', function(event) {
      reject(event);
    }, false);

    reader.readAsDataURL(file);
  });
  return future;
}

@Component({
  selector: 'app-tasksingle',
  templateUrl: './tasksingle.component.html',
  styleUrls: ['./tasksingle.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TasksingleComponent implements OnInit, AfterViewInit {
  subTasklists = [];
  isDetailsShow: any = false;
  singleTask: NgForm;
  bindingData = {};
  @ViewChild('singleTask') ssingleTask: NgForm;
  @ViewChild('singleTaskPage') singleTaskPage: ElementRef;
  lineItems: any = [];
  selectedItem = [];
  countLineItemColumn: any = 0;
  singleTaskLineItem = {tableData: {}};
  taskId: string;
  formDataLoaded = false;
  taskDetails: any = [];
  searchTextString = '';
  commentDetails: any = [];
  processingForm: any = [{}];
  involvePeople: any = '';
  involvePeopleList: any = [];
  accountId: any;
  loader = false;
  pdfpage = 1;
  zoompage = 1;
  urldownload: any;
  contentData: any;
  pdfUrl: any;
  seletedItem: any = {};
  usersData: any = [];
  keyword = 'fullName';
  onlyReadableForm = [];
  imageBase64: any = null;
  pdfLoader = false;
  isShowLineItem = false;
  diagramImage: any;
  rotateImage = 0;
  taskGetParam: any = {
    page: 0,
    state: 'completed',
    assignment: 'involved',
    sort: 'created-desc'};

      // uploader
      uploader: FileUploader;
      response: string;
      public hasBaseDropZoneOver = false;
      public hasAnotherDropZoneOver = false;


    // rubber binding variable
    cvs: HTMLCanvasElement;
    bodyrect;
    canvasrect;
    containerelem;
    img;
    clickedx;
    clickedy;
    pngwidth = 1682;
    pngheight = 2177;
    ocrResult: any;
    xintervals: CustomRect[] = [];
    yintervals: CustomRect[] = [];
    currentRects: CustomRect[] = [];
    iter1Indexes: any[] = [];
    iter2Indexes: any[] = [];
    clickedOn: any = null;
    fieldLabel: any = '';
    dateChangeIds: any = [];
    webpageload = false;
    listOfqueueData = [];
    defaultqueu = [];
    completeLoader = false;
    env = environment;
    userAccount = {id: null};
    canvas = null;
    rubberBinding = [];
    externalComments = [{text: null}];
    oldpreviewData = [];
    newpreviewData = [];
    oldPdfViewer = null;
    oldWorkunitId = "";
    newWorkunitId = "";
    newPdfViewer = null;
  // tslint:disable-next-line:max-line-length
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, public sanitizer: DomSanitizer, public router: Router,  private route: ActivatedRoute, private DBXHttp: DBXHttpService, private http: Http, private notify: NotificationService, private elementRef: ElementRef, private navService: NavService) {
    this.urldownload = environment.api_endpoint;
  }

  public onFileSelected(event: EventEmitter<File[]>) {
    const file: File = event[0];
    this.uploader.uploadAll();
  }

  ngOnInit() {
    'use strict';
    this.startScript();
    // this.initBasicSelect();
    this.route.params.subscribe( params => {
      this.taskId = params.task_id;
      this.accountId = params.account_id;
      console.log(this.accountId);
      this.taskGetParam = [this.taskId];
      this.fetchSingleTask();
      this.fetchSubTask();
    });
    if (localStorage.getItem('listofqueue')) {
      this.listOfqueueData  = JSON.parse(localStorage.getItem('listofqueue'));
      let stop = false;
      this.listOfqueueData.forEach(element => {
        if (element !== this.accountId && !stop) {
          this.defaultqueu.push(element);
        } else {
          stop = true;
        }
      });
      console.log(this.defaultqueu);
    }

    this.DBXHttp.get('DB-task/app/rest/account').subscribe((res: any) => {
      console.log(res);
      this.userAccount = res;
    });
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
    this.uploader.uploadAll();
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
    this.uploader.uploadAll();
  }

  fetchSingleTask() {
    this.DBXHttp.get('DB-task/app/rest/tasks/' + this.taskGetParam).subscribe((res: any) => {
      this.taskDetails = res;
      console.log(this.taskDetails);
      if (this.taskDetails.involvedPeople) {
        this.involvePeople = _.pluck(this.taskDetails.involvedPeople, 'fullName').join(', ');
        this.involvePeopleList = this.taskDetails.involvedPeople;
      }
      this.toolTip();
      this.fetchLatestComment();
      this.fetchContent();
      if (this.taskDetails.formKey) {
        this.fetchProcessingFrom();
      }
      this.fetchLineItem();
      //this.getShowDiagram();
      this.initUPloader(this.taskDetails.processInstanceId);

      if(this.taskDetails.created) {
        var taskdate = moment(this.taskDetails.created).format('DD-MM-YYYY');
        console.log("taskdate", taskdate);
        $('#change-taskdate').bootstrapMaterialDatePicker('setDate', moment(this.taskDetails.created));
        setTimeout(function() {
          document.getElementById('taskdate').setAttribute('readonly', 'readonly');
          $('.taskdate').css('display', 'none');
        }, 4000);
      }
    });
  }

  initUPloader(instanceId) {
    // tslint:disable-next-line:max-line-length
    this.uploader = new FileUploader({url: environment.api_endpoint + 'DB-task/app/rest/process-instances/' + instanceId + '/raw-content'});
    this.uploader.onCompleteItem = (item: FileItem, response, status, header) => {
      if (status === 200) {
        this.zoompage = 2;
        this.fetchContent();
      }
    };
  }

  fetchProcessingFrom() {
    this.loader = true;
    this.dateChangeIds = [];
    this.DBXHttp.get('DB-task/app/rest/task-forms/' + this.taskGetParam).subscribe((res: any) => {
      this.processingForm = res;
      const FormObject = {};
      this.processingForm.fields = this.processingForm.fields.map((item) => {
        if (item.type === 'date') {
          this.dateChangeIds.push(item.id);
          let translateDate = null;
          if (item.id === 'taskdate') {
            item.value =  item.value ? moment(item.value, 'DD-MM-YYYY').format('DD-MM-YYYY') : '';
          } else {
            translateDate =  item.value ? moment(item.value, 'YYYY-MM-D').format('DD-MM-YYYY') : '';
          }

          if (item.value === 'Invalid date') {
            translateDate =  item.value ? moment(item.value, 'MM/DD/YYYY').format('DD-MM-YYYY') : '';
          }

          if (item.value === 'Invalid date' || translateDate === 'Invalid date') {
            item.value =  '';
          } else if (item.id !== 'taskdate') {
            item.value = translateDate;
          }
        }

        if (item.id === 'vendoremail') {
          item.type = 'email';
        }

        if (item.value) {
          FormObject[item.id] = item.value;
        }
        if (item.readonly) {
          this.onlyReadableForm.push(item.id);
        }
        return item;
      });
      this.formDataLoaded = true;
      this.removeAttributes(this.processingForm.fields);
      let that = this;
      setTimeout(function() {
        console.log(that.ssingleTask);
        that.ssingleTask.form.patchValue(FormObject);
        that.loader = false;
        that.loadData();
      }, 3000);
    });
  }

  fetchContent() {
    this.DBXHttp.get('DB-task/app/rest/process-instances/' + this.taskDetails.processInstanceId + '/content').subscribe((res: any) => {
      this.contentData = res;
      // tslint:disable-next-line:only-arrow-functions
      const pdfData = _.findWhere(this.contentData.data, {simpleType: 'pdf'});
      if (!_.isEmpty(pdfData)) {
        this.pdfUrl = this.urldownload + 'DB-task/app/rest/content/' + pdfData.id + '/raw';
      }
      console.log(this.pdfUrl);
    });
  }

  deleteContent(contentId) {
    this.DBXHttp.delete('DB-task/app/rest/content/' + contentId).subscribe((res: any) => {
      this.fetchContent();
    });
  }

  removeAttributes(fields) {
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function() {
      fields.forEach(element => {
        if (!element.readOnly) {
          if (document.getElementById(element.id) !== null) {
            document.getElementById(element.id).removeAttribute('readonly');
          }
        }
      });
    }, 3000);
  }

  fetchLatestComment() {
    // tslint:disable-next-line:max-line-length
    this.DBXHttp.get('DB-task/app/rest/process-instances/' + this.taskDetails.processInstanceId + '/comments', {params: {latestFirst: true}}).subscribe((res: any) => {
      if (res && res.data) {
        this.commentDetails = res.data.map((element) => {
          element.message = JSON.parse(element.message);
          return element;
        });
      }
    });
  }

  updateOpenTask(form: any) {
    for (const key in form.value) {
      if (this.dateChangeIds.indexOf(key) !== -1 && !_.isEmpty(form.value[key])) {
        form.value[key] = moment(form.value[key], 'DD-MM-YYYY').format('YYYY-MM-DD');
      }
    }
    console.log(form.value);
    const formValues = {formId: this.processingForm.id, values: form.value};
    // tslint:disable-next-line:max-line-length
    this.DBXHttp.post('DB-task/app/rest/task-forms/' + this.taskDetails.id + '/save-form', formValues).subscribe((res: any) => {
      this.notify.showSuccess('WorkUnit id saved succesfully');
      this.fetchProcessingFrom();
      this.saveLineItemForm();
    }, error => {
      if (error) {
        const errorData = JSON.parse(error);
        this.notify.showError('WorkUnit id could not be saved due to' + errorData.message);
      }
    });
  }

  saveLineItemForm() {
    let lineItemData = this.getLineItemFormValues();
    if (!_.isEmpty(lineItemData.tableData)) {
      let payload = {TableData: { tableData: lineItemData.tableData}, FormData: this.bindingData, WordData: this.rubberBinding};
      this.DBXHttp.post('ap-services-lineitem/apservice/processInstanceId/' + this.taskDetails.processInstanceId, payload).subscribe((res: any) => {
        this.fetchLineItem();
        this.notify.showSuccess('Line items changes saved succesfully');
      });
    }
  }

  completeTask(type = null, form: any = null) {
    this.completeLoader = true;
    for (const key in form.value) {
      if (this.dateChangeIds.indexOf(key) !== -1 && !_.isEmpty(form.value[key])) {
        if (key === 'taskdate') {
          form.value[key] = moment(form.value[key], 'DD-MM-YYYY').format('DD-MM-YYYY');
        } else {
          form.value[key] = moment(form.value[key], 'DD-MM-YYYY').format('YYYY-MM-DD');
        }
      }
    }
    if (type === 'validation') {
      this.validationPost(form);
    } else if (type === 'duplicate') {
      this.duplicatePost(form);
    } else if (type === 'Match') {
      this.matchPost(form);
    } else if (type === 'complete') {
      this.defaultPost(form, 'complete');
    } else {
      this.defaultPost(form, null);
    }

    this.saveLineItemForm();
  }

  matchPost(form: any) {
    const formValues = {formId: this.processingForm.id, outcome: 'Match', values: { taskIdActual: this.taskDetails.id}};
    formValues.values = Object.assign(formValues.values, form.value);
    this.DBXHttp.post('DB-task/app/rest/task-forms/' + this.taskDetails.id, formValues).subscribe((res: any) => {
      this.navService.emitNavChangeEvent(true);
      this.notify.showSuccess('WorkUnit id submitted succesfully');
      this.fetchSingleTask();
      this.completeLoader = false;
      const route = 'task/' + this.accountId;
      this.router.navigate([route]);
    }, error => {
      if (error) {
        const errorData = JSON.parse(error);
        this.notify.showError('WorkUnit id could not be submitted due to ' +
          errorData.message);
      }
      this.completeLoader = false;
    });
  }

  openCompare() {
    let obj = _.findWhere(this.processingForm.fields, {id: "workunitid"});
    this.oldpreviewData = [];
    this.newpreviewData = [];
    this.DBXHttp.get('jsflab/rest/DBDuplicateCheck/getDuplicateItemDetails/?workunitid=' + obj.value).subscribe((res: any) => {
      console.log(res.existingData);
      let dataValue  = res.existingData.split(',');
      dataValue = dataValue.filter((ele) => {
        return ele != '';
      })
      this.newWorkunitId = res.duplicateWorkunitId;
      this.oldWorkunitId = res.workunitId;
      this.oldPdfViewer = res.fileId ? this.urldownload + 'DB-task/app/rest/content/' + res.fileId + '/raw' : null;
      this.newPdfViewer = res.fileId ? this.urldownload + 'DB-task/app/rest/content/' + res.fileId + '/raw' : null;
      console.log("this.oldPdfViewer", this.oldPdfViewer);
      dataValue.forEach(element => {
        console.log(element);
        let obj = element.split('-');
        this.oldpreviewData.push({
          key: obj[0],
          value: obj[1]
        });
      });

      let arrayObj = this.oldpreviewData.map((ele) => {
        return ele.key;
      });
      this.processingForm.fields.forEach(element => {
        if(arrayObj.indexOf(element.id) >= 0) {
          this.newpreviewData.push({
            key: element.id,
            value: element.value
          });
        }
      });

      //this.subTasklists = res;
    });
   
    
    
  }

  duplicatePost(form: any) {
    const formValues = {formId: this.processingForm.id, outcome: 'Check Duplicate', values: { taskIdActual: this.taskDetails.id}};
    formValues.values = Object.assign(formValues.values, form.value);
    this.DBXHttp.post('DB-task/app/rest/task-forms/' + this.taskDetails.id, formValues).subscribe((res: any) => {
      this.navService.emitNavChangeEvent(true);
      this.notify.showSuccess('WorkUnit id submitted succesfully');
      this.fetchSingleTask();
      this.completeLoader = false;
      const route = 'task/' + this.accountId;
      this.router.navigate([route]);
    }, error => {
      if (error) {
        const errorData = JSON.parse(error);
        this.notify.showError('WorkUnit id could not be submitted due to ' + errorData.message);
      }
      this.completeLoader = false;
    });
  }

  validationPost(form: any) {
    const formValues = {formId: this.processingForm.id, values: {taskIdActual: this.taskDetails.id, validation: form.value.validation}};
    this.DBXHttp.post('DB-task/app/rest/task-forms/' + this.taskDetails.id, formValues).subscribe((res: any) => {
      this.navService.emitNavChangeEvent(true);
      this.notify.showSuccess('WorkUnit id submitted succesfully');
      this.fetchSingleTask();
      this.completeLoader = false;
      const route = 'task/' + this.accountId;
      this.router.navigate([route]);
    }, error => {
      if (error) {
        const errorData = JSON.parse(error);
        this.notify.showError('WorkUnit id could not be submitted due to ' + errorData.message);
      }
      this.completeLoader = false;
    });
  }

  defaultPost(form: any, type: any) {
    const formValues = {formId: this.processingForm.id, values: { taskIdActual: this.taskDetails.id}};
    formValues.values = Object.assign(formValues.values, form.value);
    this.DBXHttp.post('DB-task/app/rest/task-forms/' + this.taskDetails.id, formValues).subscribe((res: any) => {
      this.navService.emitNavChangeEvent(true);
      this.notify.showSuccess('WorkUnit id submitted succesfully');
      if (type === 'complete') {
        const route = 'task/' + this.accountId;
        this.router.navigate([route]);
      } else {
        const route = 'task/' + this.accountId;
        this.router.navigate([route]);
      }
      this.completeLoader = false;
      this.fetchSingleTask();
    }, error => {
      if (error) {
        const errorData = JSON.parse(error);
        this.notify.showError('WorkUnit id could not be submitted due to ' + errorData.message);
      }
      this.completeLoader = false;
    });
  }

  submitClaim(taskId) {
    this.DBXHttp.put('DB-task/app/rest/tasks/' + this.taskDetails.id + '/action/claim', {}).subscribe((res: any) => {
      this.notify.showSuccess('WorkUnit has been claim successfully');
      this.fetchSingleTask();
    });
  }

  complete() {
    this.DBXHttp.put('DB-task/app/rest/tasks/' + this.taskDetails.id + '/action/complete', {}).subscribe((res: any) => {
      this.notify.showSuccess('WorkUnit has been complete successfully');
      this.fetchSingleTask();
    });
  }

  fetchSubTask() {
    // tslint:disable-next-line:max-line-length
    this.DBXHttp.get('DB-task/app/rest/tasks/' + this.taskGetParam + '/subtasks', {params: {latestFirst: true}}).subscribe((res: any) => {
      console.log(res);
      this.subTasklists = res;
    });
  }

  fetchLineItem() {
    // tslint:disable-next-line:max-line-length
    this.DBXHttp.get('ap-services-lineitem/apservice/processInstanceId/' + this.taskDetails.processInstanceId).subscribe((res: any) => {
      console.log("teststt", res);
      this.singleTaskLineItem = res.TableData;
      this.bindingData = res.FormData;
      this.rubberBinding = res.WordData;
      this.generateData();
      this.generateRubberBinding();
    });
  }


  checkValue(event: any) {
    this.isDetailsShow = event.target.checked;
  }

  async startScript() {
    await this.dynamicScriptLoader.load('form.min', 'lightgallery').then( data => {
      this.loadData();
    }).catch(error => console.log(error));
  }

  private toolTip() {
    $('[data-toggle="tooltip"]').tooltip({container: 'body', html: true});
  }

  private initBasicSelect() {
    /* basic select start*/
    $('select').formSelect();
    $('#sel').formSelect();
    let data = [{ id: 1, name: 'Option 1' }, { id: 2, name: 'Option 2' }, { id: 3, name: 'Option 3' }];

    let Options = '';
    $.each(data, function(i, val) {
      $('#sel').append('<option value=\'' + val.id + '\'>' + val.name + '</option>');
      $('#sel').formSelect();
    });
    /* basic select end*/
  }

  private loadData() {
    let that = this;
    $('#aniimated-thumbnials').lightGallery({
      thumbnail: true,
      selector: 'a'
    });
    // $('#form_advanced_validation input').on('click', function() {
    //   $('#form_advanced_validation input').removeClass('lastClick');
    //   $(this).addClass('lastClick');
    // });
    $('#pdfContainer').resize(function($event) {
      console.log($event.target.clientWidth);

      if (($event.target.clientWidth == 902 || $event.target.clientWidth == 802) && that.webpageload == true) {
        console.log('ttttt');
        // that.pageRendered(true);
      }
      that.webpageload = true;
    });

    $('form input').keypress(function(e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
          return false;
        } else {
          return true;
        }
    });
    let  invoiceamount = $('#invoiceamount').val();
    $('#invoiceamount').focusout(() => {
      let amount = $('#invoiceamount').val();
      if(amount !== invoiceamount){
        swal({
          title: 'Are you sure?',
          text: 'want to change invoice amount.',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: 'Yes!',
          cancelButtonText: 'Cancel',
          closeOnConfirm: true,
          closeOnCancel: true
        // tslint:disable-next-line:only-arrow-functions
        }, function(isConfirm) {
          if (isConfirm == true) {
            document.getElementById('invoiceamount').setAttribute('readonly', 'readonly');
            invoiceamount = $('#invoiceamount').val();
          } else {
            $('#invoiceamount').val(invoiceamount);
          }
        });
      }
      
    });

    $('.datepicker').bootstrapMaterialDatePicker({
      format: 'DD-MM-YYYY',
      clearButton: true,
      weekStart: 1,
      time: false,
      triggerEvent: 'dblclick',
      switchOnClick: false
    });
    
    this.dateChangeIds.forEach(element => {
      const that = this;
      $('#change-' + element).bootstrapMaterialDatePicker().on('change', function(e, date) {
        console.log(e, date);

        if(element== 'podate') {
          let dd:any = document.getElementById('invoicedate');
         
          if(!dd.value) {
            swal('Warning', 'Invoice Date should be filled up', 'error');
            return false;
          }
          let invoicetime = dd.value ? moment(dd.value, 'DD-MM-YYYY').unix() : 0
          let potime = moment(e.target.value, 'DD-MM-YYYY').unix();
          console.log(invoicetime >= potime, invoicetime, potime, e.target.value, dd.value)
          if(dd.value && invoicetime < potime) {
            swal('Warning', 'PO Date should be less than invoice date', 'error');
            return false;
          }
          let obj = {};
          // tslint:disable-next-line: max-line-length
          obj[element] =  (e.target.value !== 'invalid date' && !_.isEmpty(e.target.value)) ?  moment(e.target.value, 'DD-MM-YYYY').format('DD-MM-YYYY') : '';
          that.ssingleTask.form.patchValue(obj);
        } else {
          let obj = {};
          // tslint:disable-next-line: max-line-length
          obj[element] =  (e.target.value !== 'invalid date' && !_.isEmpty(e.target.value)) ?  moment(e.target.value, 'DD-MM-YYYY').format('DD-MM-YYYY') : '';
          that.ssingleTask.form.patchValue(obj);
        }
       
      });
    });

    // Advanced Form Validation
    $('#form_advanced_validation').validate({
        rules: {
            date: {
                customdate: true
            },
            creditcard: {
                creditcard: true
            }
        },
        highlight (input) {
            $(input).parents('.form-line').addClass('error');
        },
        unhighlight (input) {
            $(input).parents('.form-line').removeClass('error');
        },
        errorPlacement (error, element) {
            $(element).parents('.form-group').append(error);
        }
    });

    var thast = this;
    $('#leftSide').scroll(function() {
      if ($( "#rectangleBox" ).hasClass( "rectangleBox" )) {
        $('#selectedBindingData').remove();
        $('#lineDraw').remove();
        thast.generateLine();
        thast.getCtx();
      } else {
        if($("#selectedBindingData").lenght !== 0) {
          let id = $("#selectedBindingData").attr('data-id');
          $('#lineDraw').remove();
          thast.generateLine();
          thast.getCtx(id, 'lastClick');
        }
      }
    });

    $('#pdf-canvass').scroll(function() {
      if ($( "#rectangleBox" ).hasClass( "rectangleBox" )) {
        $('#selectedBindingData').remove();
        $('#lineDraw').remove();
        thast.generateLine();
        thast.getCtx();
      } else {
        if($("#selectedBindingData").lenght !== 0) {
          let id = $("#selectedBindingData").attr('data-id');
          $('#lineDraw').remove();
          thast.generateLine();
          thast.getCtx(id, 'lastClick');
        }
      }
    });

    $('#leftBoxData').click(function(){
      $('#lineDraw').remove();
    });

    $('#leftSide').resize(function() {
      if ($( "#rectangleBox" ).hasClass( "rectangleBox" )) {
        $('#selectedBindingData').remove();
        $('#lineDraw').remove();
        thast.generateLine();
        thast.getCtx();
      }
    });

    $('#form_advanced_validation input').focus(function() {
        if ($( "#rectangleBox" ).hasClass( "rectangleBox" )) {
          $('#selectedBindingData').remove();
          $('#lineDraw, #rectangleBox').remove();
        }
        $('#lineDraw, #rectangleBox').remove();
        $('#form_advanced_validation input').removeClass('lastClick');
        $(this).addClass('lastClick');
        
        let inputId = $(this).attr('id').replace(/\s/g, '');
        let obj = _.findWhere(thast.processingForm.fields, {id: inputId});
        let inputName = obj.name.replace(/\s/g, '');
        let ObjectData = thast.bindingData[inputName];
        let colorCode = "#d93025";
        $(this).css("border", "1px solid #b8b8b8");
        if(ObjectData) {
          if(ObjectData.Confidence * 100 >= 90) {
            colorCode = "green";
          } else if(ObjectData.Confidence * 100 < 90 && ObjectData.Confidence * 100 > 50 ) {
            colorCode = "#FFBF00";
          }

          console.log(ObjectData.boundingBox, inputName);
          let currentRatioWidth = 816;
          let currentRatioHeight = 1056;
          console.log(obj, thast.processingForm.fields, inputName, ObjectData, currentRatioHeight, currentRatioWidth, (ObjectData.boundingBox.Left * currentRatioWidth));
          $('#rectangleBox').remove();
          $('#page1').after('<div id=\'rectangleBox\' class=\'rectangleBox\' style="left: ' + (ObjectData.boundingBox.left * currentRatioWidth) + 'px; top: ' + (ObjectData.boundingBox.top * currentRatioHeight) + 'px; width: ' + (ObjectData.boundingBox.width * currentRatioWidth) + 'px; height: ' + (ObjectData.boundingBox.height * currentRatioHeight) + 'px; "></div>');
          $(this).addClass('selectedInput');
          $('input').removeClass('selectedInput');
          $(this).addClass('selectedInput');
          $(this).css("border", "1px solid " + colorCode);

          //document.getElementById('pdf-canvass').scrollIntoView({ behavior: 'smooth'});
          $('#pdf-canvass').animate({scrollTop: (ObjectData.boundingBox.top * currentRatioHeight)}, '150');
          //document.getElementById('pdf-canvass').scrollTop({behavior: 'smooth', top:  (ObjectData.boundingBox.Top / currentRatioHeight) });
          $('#lineDraw').remove();
          thast.generateLine();
          thast.getCtx();
        } else {
          $(this).css("border", "1px solid " + colorCode);
        }


        
    // tslint:disable-next-line: only-arrow-functions
    }).blur( () => {
      $(this).css("border", "1px solid #b8b8b8");
    }).focusout(() => {
      $('#lineDraw').remove();
      $(this).css("border", "1px solid #b8b8b8");
    });
  }



  changeZoomIn() {
    if(this.zoompage < 6) {
      this.zoompage = this.zoompage + 1;
    }
  }

  changeZoomOut() {
    if(this.zoompage > 1) {
      this.zoompage = this.zoompage - 1;
    }
  }

  changeInputPage($event) {
    this.pdfpage = $event.target.value;
  }

   // involve people
   selectEvent(item) { this.seletedItem = item; this.assignUser(); }
   onChangeSearch(val: string) { if (val) { this.searchUser(val); } else { this.usersData = []; } }
   clearInput(e) { this.seletedItem = {}; }

  searchUser(val) {
    // tslint:disable-next-line:max-line-length
    this.DBXHttp.get('DB-task/app/rest/workflow-users?filter=' + val).subscribe((res: any) => {
      this.usersData = res.data;
    });
  }

  // getShowDiagram() {
  //   console.log('diagram', this.taskDetails);
  //   const option = {
  //     headers: {
  //       'Content-Type': 'image/png',
  //       Authorization: 'Basic ' + btoa('rest-admin:test')
  //     }
  //   };
  //   // tslint:disable-next-line: max-line-length
  //   this.http.get(environment.api_endpoint + 'flowable-rest/service/runtime/process-instances/' + this.taskDetails.processInstanceId + '/diagram', option)
  //   .map(res => {
  //     return new Blob([res._body], {
  //       type: res.headers.get("Content-Type")
  //     });
  //   })
  //   .map(blob => {
  //       var urlCreator = window.URL;
  //       return  urlCreator.createObjectURL(blob)
  //   })
  //   .subscribe((res: any) => {
  //     console.log(res);
  //     this.diagramImage = res;
  //   });
  // }

  assignUser() {
    if (this.seletedItem) {
      // tslint:disable-next-line:max-line-length
      this.DBXHttp.put('DB-task/app/rest/tasks/' + this.taskId + '/action/assign', { assignee: this.seletedItem.id }).subscribe((res: any) => {
        this.fetchSingleTask();
        $('#select_person .cancel').click();
        this.seletedItem = {};
      });
    }
  }


  checkcondition(endDate, assignee) {
    return (endDate !== undefined && endDate === null && assignee && this.userAccount && this.userAccount.id === assignee);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.log(event);
  }
  ngAfterViewInit() {}


  _listener = (event) => {
    console.log('test');
  }

  getPixel(event) {
    event.stopImmediatePropagation();
    console.log(event);
    // console.log(this.canvasrect);
    this.canvasrect = this.cvs.getBoundingClientRect();
    console.log(this.canvasrect);
    this.clickedx = event.pageX - this.canvasrect.x;
    this.clickedy = event.pageY - window.pageYOffset - (this.canvasrect.y);
    const clickedPixel: CustomPixel = { 'x': (this.clickedx), 'y': (this.clickedy) };
    console.log('You clicked ' + JSON.stringify(clickedPixel));
    // return clickedPixel;
    const originalPixel: CustomPixel = this.clickedPixelToOriginalPixel(clickedPixel);
    console.log('Original Pixel ' + JSON.stringify(originalPixel));

    this.clickedOn = 'test';



    this.currentRects = this.findRect(originalPixel);
    console.log('You clicked inside ');
    // console.log(this.currentRects)
    if (this.iter2Indexes.length > 0) {
      console.log('Recognized word is ');
      console.log('tets');
      console.log(this.ocrResult.words[this.iter2Indexes[0]].text);
      this.clickedOn = this.ocrResult.words[this.iter2Indexes[0]].text;
      const objKey = $('.lastClick').attr('id');
      if (_.isEmpty($('.lastClick').val())) {
        let tempObj = {};
        tempObj[objKey] = this.clickedOn;
        this.ssingleTask.form.patchValue(tempObj);
      }
    }
  }

  clickedPixelToOriginalPixel(clickedPixel: CustomPixel) {
    // let originalPixel: CustomPixel = { "x": "", "y": "" };
    const canvasWidth = (this.canvasrect.width);
    const canvasHeight = (this.canvasrect.height);
    const originalX = this.pngwidth / canvasWidth * clickedPixel.x;
    const originalY = this.pngheight / canvasHeight * clickedPixel.y;
    return { 'x': Math.ceil(originalX), 'y': Math.ceil(originalY) };
  }

  findRect(pix: CustomPixel) {
    this.yintervals = [];
    this.iter1Indexes = [];
    this.iter2Indexes = [];
    for (let j = 0; j < this.ocrResult.words.length; j++) {
      const tempRect: CustomRect = this.ocrResult.words[j].bbox;
      if (pix.x >= tempRect.x0 && pix.x <= tempRect.x1) {
        this.yintervals.push(tempRect);
        this.iter1Indexes.push(j);
      }
    }
    if (this.yintervals.length > 0) {
      const rectarray: CustomRect[] = [];
      for (let j = 0; j < this.yintervals.length; j++) {
        if (pix.y >= this.yintervals[j].y0 && pix.y <= this.yintervals[j].y1) {
          rectarray.push(this.yintervals[j]);
          this.iter2Indexes.push(this.iter1Indexes[j]);
        }

      }
      if (rectarray.length > 0) { return rectarray; }
      else { return null; }
    } else { return null; }
  }

  doOCR() {
    console.log('Printing image');
    console.log(this.imageBase64);
    console.log('OCR Results');
    let a = this;
    Tesseract.recognize(this.imageBase64, {
      tessedit_pageseg_mode: '6',
    }).progress(function(p) { })
    .then(function(result) {
        console.log('result_text', JSON.stringify(result.text));
        console.log('result ', result);
        console.log(a);
        a.pdfLoader = false;
        a.ocrResult = result;
        a.zoompage = 1;
    }, function() {
      a.pdfLoader = false;
    });
    this.pdfLoader = false;
    this.zoompage = 1;

  }

  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        let byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  showLineItem() {
    this.isShowLineItem = true;
    window.scrollTo(0, 200);
    this.getLineItemFormValues();
  }
  closeLineItem() {
    this.isShowLineItem = false;
    window.scrollTo(0, 0);
  }

  generateData() {
    let headerValues = this.singleTaskLineItem.tableData;
    let tempData = [];
    // tslint:disable-next-line: forin
    for (const entry in headerValues) {
      tempData.push(Object.values(headerValues[entry]));
      this.countLineItemColumn = Object.values(headerValues[entry]).length;
    }
    console.log('test', tempData);
    this.lineItems = tempData;
  }

  getLineItemFormValues() {
    var form = $('#lineItems').serializeArray();
    let countOfRow = this.lineItems.length;
    let tempData = [];
    for (var i = 1; i <= countOfRow; i++) {
      form.forEach(element => {
        if (element.name == i) {
          if (tempData[i] == undefined) {
            tempData[i] = [];
            tempData[i].push(element.value);
          } else {
            tempData[i].push(element.value);
          }
        }
      });
    }

    let modifyData = _.filter(tempData , function (value) {
      return !_.isEmpty(value);
    });
    console.log('modifyData', modifyData);
    let finalObj = {'tableData' : {}};
    modifyData.forEach((element, index) => {
      var k = 1;
      let y = element.reduce((acc, elem) => {
        acc[k] = elem // or what ever object you want inside
        k++;
        return acc;
      }, {});
      console.log('y', y);
      finalObj.tableData[index + 1] = y;
    });
    console.log(finalObj);
    return finalObj;
  }

  addLineItem() {
    let dd = [];
    for (var d = 1; d < this.countLineItemColumn; d++) {
      dd.push('');
    }
    this.lineItems.push(dd);
  }
  selectItem(i) {
    this.selectedItem.push(i);
  }
  UnSelectItem(i) {
    var index = this.selectedItem.indexOf(i);
    if (index > -1) {
      this.selectedItem.splice(index, 1);
    }
  }
  deleteLineItem() {
    var that = this;
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this line item!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      closeOnConfirm: false,
      closeOnCancel: false
    // tslint:disable-next-line:only-arrow-functions
    }, function(isConfirm) {
      if (isConfirm) {
        // that.selectedItem.forEach(function(value , indexvalue) {
        //   console.log(value);
        //   that.lineItems.splice(value, 1);
        // });
        that.lineItems = that.lineItems.filter(function(value, index) {
          return that.selectedItem.indexOf(index) == -1;
        });
        that.selectedItem = [];
        swal('Deleted!', 'Line Item has been remove from list, Please click on save button.', 'success');
      } else {
        swal('Cancelled', 'Line Item not removed :)', 'error');
      }
    });
  }


  generateLine() {
    this.canvas = document.createElement('canvas'); //Create a canvas element
    this.canvas.width = $('#itemContainer').width();
    this.canvas.height = $(window).height();
    this.canvas.style.position = 'absolute';
    this.canvas.style.zIndex = 100000;
    this.canvas.style.pointerEvents = 'none'; //Make sure you can click 'through' the canvas
    this.canvas.id = 'lineDraw';
    document.getElementById('itemContainer').appendChild(this.canvas);
  }

  getCtx(rectangleBox = "rectangleBox", inputSelector = "selectedInput") {
    const ctx = this.canvas.getContext('2d');
    ctx.beginPath();
    const inputOffset = $('input.'+inputSelector).offset();
    if(inputOffset.top && document.getElementById(rectangleBox)) {
      const leftside = document.getElementById('form_advanced_validation').clientWidth - 3;
      console.log(inputOffset);
      // Start and end points
      ctx.beginPath();
      ctx.arc(leftside + 13, inputOffset.top - 215, 6, 0, 2 * Math.PI);   // Start point
      ctx.strokeStyle = '#0bb3ff';
      ctx.stroke();

      ctx.moveTo(leftside + 19, inputOffset.top - 215);

      const rectangleBoxOffsetLeft = document.getElementById(rectangleBox).offsetLeft;
      const rectangleBoxOffsetTop = document.getElementById(rectangleBox).offsetTop; //$('#rectangleBox').offset();
      const scrollDiv = document.getElementById('pdf-canvass').clientWidth;
      const pageIdWidth = document.getElementById('page1').clientWidth;
      console.log(rectangleBoxOffsetTop, rectangleBoxOffsetLeft, scrollDiv, pageIdWidth);
      const offsetRectagle = $('#'+rectangleBox).offset();


      const scrollTop = rectangleBoxOffsetTop - $('#pdf-canvass').scrollTop();

      // element lenght
      const elemetDivideLenght = rectangleBoxOffsetLeft / 2;
      let extraLenght = (pageIdWidth < scrollDiv) ? (scrollDiv - pageIdWidth) :  ( pageIdWidth - scrollDiv);
      const leftWidth = $('#leftSide').width() + 40;
      // console.log("leftside", $('#leftSide').width() + 40, rectangleBoxOffsetLeft );
      const start = {x: ( leftWidth + (elemetDivideLenght + (elemetDivideLenght / 2))), y: (scrollTop + 62)};
      const curvepoint = {x: (leftWidth + (elemetDivideLenght + (elemetDivideLenght / 2))), y: (scrollTop + 62)};
      const end = {x: ( leftWidth + rectangleBoxOffsetLeft), y: (offsetRectagle.top - 232)};

      // console.log(start.x, start.y, curvepoint.x, curvepoint.y, end.x, end.y, $('#rectangleBox'), $('#pdf-canvass'));
      // start.x = 480 + 80;
      // start.y = 120;
      // curvepoint.x = 480 + 80;
      // curvepoint.y = 120;
      // end.x = 480 + 80;
      // end.y = 120;

      ctx.bezierCurveTo(start.x, start.y, curvepoint.x, curvepoint.y, end.x, end.y);
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  rubberbindingElement(id, text) {
    $('#lineDraw, #rectangleBox, #selectedBindingData').remove();
    //$('#page1').after('<div id=\'rectangleBox\' class=\'rectangleBox\' style="left: ' + (ObjectData.boundingBox.left * currentRatioWidth) + 'px; top: ' + (ObjectData.boundingBox.top * currentRatioHeight) + 'px; width: ' + (ObjectData.boundingBox.width * currentRatioWidth) + 'px; height: ' + (ObjectData.boundingBox.height * currentRatioHeight) + 'px; "></div>');
    this.generateLine();
    this.getCtx(id, "lastClick");
    $('.rubberbiding-rect').removeClass('active');
    $('#' + id).addClass('active');
    let ainputName = $('input.lastClick').attr("id");
    console.log(ainputName);
    let obj = {};
    obj[ainputName] = text;
    this.ssingleTask.form.patchValue(obj);
    $('#page1').after('<div id="selectedBindingData" data-id="' + id + '"></div>');
  }
  generateRubberBinding() {
    var that = this;
    this.rubberBinding = this.rubberBinding.map((element, index) => {
      if(element.geometry) {
        element.geometry.boundingBox.width = element.geometry.boundingBox.width * 816;
        element.geometry.boundingBox.height = element.geometry.boundingBox.height * 1056;
        element.geometry.boundingBox.left = element.geometry.boundingBox.left * 816;
        element.geometry.boundingBox.top = element.geometry.boundingBox.top * 1056 - $('#pdf-canvass').scrollTop();
      }
      return element;
      //$('#page1').after('<div id="' + element.Id + '" onclick="rubberbindingElement(\''+element.Id+'\',\''+element.Text+'\')" class="rubberbiding-rect" style="left: ' + left + 'px; top: ' + top + 'px; width: ' + width + 'px; height: ' + height + 'px; "></div>');
    });
  }

  commentAdd() {
    this.externalComments.push({text: null});
  }

  commentRemove(index) {
    this.externalComments.splice(index, 1);
  }

  rotated() {
    if (this.rotateImage > 360) {
      this.rotateImage = 0;
    } else {
      this.rotateImage = this.rotateImage + 90;
    }
  }

}
