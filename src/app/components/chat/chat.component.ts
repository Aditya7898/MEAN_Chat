import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {
  tabElements: any;
  constructor() {}

  ngOnInit() {
    this.tabElements = document.querySelector('.nav-content');
  }

  ngAfterViewInit() {
    this.tabElements.style.display = 'none';
  }
}
