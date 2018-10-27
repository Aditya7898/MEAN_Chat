import {
  Component,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import * as M from 'materialize-css';
import { UsersService } from '../../services/users.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import * as _ from 'lodash';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, AfterViewInit {
  @Output()
  onlineUsers = new EventEmitter();

  user: any;
  socket: any;
  notifications = [];
  count = [];
  chatList = [];
  msgNum = 0;
  imageId: any;
  imageVersion: any;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private userService: UsersService,
    private messageService: MessageService
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngAfterViewInit() {
    this.socket.on('usersOnline', data => {
      // console.log(data);
      this.onlineUsers.emit(data);
    });
  }

  ngOnInit() {
    this.user = this.tokenService.getPayload();
    // console.log(this.user);

    // online event
    this.socket.emit('online', { room: 'global', user: this.user.username });

    // dropdown
    const dropDownElement = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropDownElement, {
      alignment: 'right',
      hover: false,
      coverTrigger: false
    });
    const dropDownElementTwo = document.querySelectorAll('.dropdown-trigger1');
    M.Dropdown.init(dropDownElementTwo, {
      alignment: 'right',
      hover: false,
      coverTrigger: false
    });
    //

    this.socket.on('refreshPage', () => {
      this.GetUser();
    });
    this.GetUser();
  }

  //  GetUser method
  GetUser() {
    this.userService.getUserById(this.user._id).subscribe(
      data => {
        this.imageId = data.result.picId;
        this.imageVersion = data.result.picVersion;

        this.notifications = data.result.notifications.reverse();
        const value = _.filter(this.notifications, ['read', false]); // object array
        this.count = value;
        this.chatList = data.result.chatList;
        // check if read
        this.checkIfRead(this.chatList);
        // console.log(this.msgNum);
      },
      err => {
        if (err.error.token === null) {
          this.tokenService.deleteToken();
          this.router.navigate(['']);
        }
      }
    );
  }

  // check If lastmessage is read or not
  checkIfRead(arr) {
    const checkArray = [];
    for (let i = 0; i < arr.length; i++) {
      const receiver = arr[i].msgId.message[arr[i].msgId.message.length - 1];
      if (this.router.url !== `/chat/${receiver.sendername}`) {
        if (
          receiver.isRead === false &&
          receiver.receivername === this.user.username
        ) {
          checkArray.push(1);
          this.msgNum = _.sum(checkArray);
        }
      }
    }
  }

  // mark all notifications
  markAll() {
    this.userService.markAllAsRead().subscribe(data => {
      // console.log(data);
    });
    this.socket.emit('refresh', {});
  }

  // logout
  logout() {
    this.tokenService.deleteToken();
    this.router.navigate(['']);
    this.socket.emit('disconnect', {});
    this.socket.emit('refresh', {});
  }

  // go to home
  GoToHome() {
    this.router.navigate(['/streams']);
  }

  // navigate to chatPage
  goToChatPage(username) {
    this.router.navigate(['chat', username]);
    this.messageService
      .MarkMessages(this.user.username, username)
      .subscribe(data => {
        // console.log(data);
      });
    this.socket.emit('refresh', {});
  }

  // markAllMessages
  markAllMessages() {
    this.messageService.MarkAllMessages().subscribe(data => {
      this.socket.emit('refresh', {});
      this.msgNum = 0;
      // console.log(data);
    });
  }

  // Time change
  TimeFromNow(time) {
    return moment(time).fromNow();
  }

  MessageDate(time) {
    return moment(time).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: 'DD/MM/YYYY',
      sameElse: 'DD/MM/YYYY'
    });
  }
}
