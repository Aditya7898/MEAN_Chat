import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { TokenService } from '../../services/token.service';
import io from 'socket.io-client';
import * as moment from 'moment';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  socket: any;
  user: any;
  notifications = [];

  constructor(
    private userService: UsersService,
    private tokenService: TokenService
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.getPayload();
    this.getUserById();
    this.socket.on('refreshPage', () => {
      this.getUserById();
    });
  }

  getUserById() {
    this.userService.getUserById(this.user._id).subscribe(data => {
      console.log(data);
      this.notifications = data.result.notifications.reverse();
    });
  }

  TimeFromNow(time) {
    return moment(time).fromNow();
  }

  markNotification(data) {
    console.log(data);
    this.userService.MarkNotification(data._id).subscribe(resp => {
      this.socket.emit('refresh', {});
    });
  }

  deleteNotification(data) {
    console.log(data);
    this.userService.MarkNotification(data._id, true).subscribe(res => {
      this.socket.emit('refresh', {});
    });
  }
}

// notifications
// this.userService.getUserByName(this.user.username).subscribe(data => {
//   console.log(data);
//   this.notifications = data.result.notifications;
// });
