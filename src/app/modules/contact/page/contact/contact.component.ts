/* eslint-disable @typescript-eslint/naming-convention */
import { AfterViewInit, Component, OnInit } from '@angular/core';
declare const TradingView: any;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, AfterViewInit {
  html = '<iframe src="https://ta.vietstock.vn/?lang=vi&stockCode=AAA" title="" width="100%" height="100%"></iframe>';
  constructor() { }
  ngOnInit() {
  }
  ngAfterViewInit(){
  }
}


