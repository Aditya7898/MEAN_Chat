import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import * as M from 'materialize-css';
import { UsersService } from '../../services/users.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import * as _ from 'lodash';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  user: any;
  socket: any;
  notifications = [];
  count = [];

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private userService: UsersService
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.getPayload();
    console.log(this.user);

    const dropDownElement = document.querySelector('.dropdown-trigger');
    M.Dropdown.init(dropDownElement, {
      alignment: 'right',
      hover: true,
      coverTrigger: false
    });
    this.socket.on('refreshPage', () => {
      this.GetUser();
    });
    this.GetUser();
  }

  GetUser() {
    this.userService.getUserById(this.user._id).subscribe(
      data => {
        this.notifications = data.result.notifications.reverse();
        const value = _.filter(this.notifications, ['read', false]); // object array
        console.log(value);
        this.count = value;
      },
      err => {
        if (err.error.token === null) {
          this.tokenService.deleteToken();
          this.router.navigate(['']);
        }
      }
    );
  }

  markAll() {
    this.userService.markAllAsRead().subscribe(data => {
      console.log(data);
    });
    this.socket.emit('refresh', {});
  }

  logout() {
    this.tokenService.deleteToken();
    this.router.navigate(['']);
  }

  GoToHome() {
    this.router.navigate(['/streams']);
  }

  TimeFromNow(time) {
    return moment(time).fromNow();
  }
}
