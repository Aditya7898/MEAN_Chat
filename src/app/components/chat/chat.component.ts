import { Component, OnInit, AfterViewInit } from '@angular/core';
import io from 'socket.io-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {
  online_users = [];
  tabElements: any;
  socket: any;
  constructor() {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.tabElements = document.querySelector('.nav-content');
    this.socket.on('usersOnline', (data) => { console.log(data); });
  }

  ngAfterViewInit() {
    this.tabElements.style.display = 'none';
  }

  OnlineUsers(data) {
    console.log(data);
    this.online_users = data;
  }
}
