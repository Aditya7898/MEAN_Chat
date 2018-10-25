import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {
  online_users = [];
  tabElements: any;
  constructor() {}

  ngOnInit() {
    this.tabElements = document.querySelector('.nav-content');
  }

  ngAfterViewInit() {
    this.tabElements.style.display = 'none';
  }

  OnlineUsers(data) {
    console.log(data);
    this.online_users = data;
  }
}
