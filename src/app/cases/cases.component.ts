import { Component, OnInit } from '@angular/core';

declare const $: any;
declare const swal: any;

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.scss']
})
export class CasesComponent implements OnInit {
  title = 'Cases';
  constructor() { }
  ngOnInit() { }


}
