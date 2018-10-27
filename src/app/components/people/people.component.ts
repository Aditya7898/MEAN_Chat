import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import * as _ from 'lodash';
import { TokenService } from '../../services/token.service';
import io from 'socket.io-client';
import { Router } from '@angular/router';
@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  users = [];
  loggedInUser: any;
  userArr = [];
  socket: any;
  onlineUsers = [];

  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.getUsers();
    this.GetUserById();
    this.socket.on('refreshPage', () => {
      this.getUsers();
      this.GetUserById();
    });
  }
  getUsers() {
    this.userService.getAllUsers().subscribe(data => {
      _.remove(data.result, { username: this.loggedInUser.username });
      this.users = data.result;
    });
  }

  followUser(user) {
    console.log(user);
    this.userService.followUser(user._id).subscribe(data => {});
    this.socket.emit('refresh', {});
  }

  GetUserById() {
    this.userService.getUserById(this.loggedInUser._id).subscribe(data => {
      this.userArr = data.result.following;
    });
  }

  checkInArray(arr, id) {
    const result = _.find(arr, ['userFollowed._id', id]);
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  online(data) {
    this.onlineUsers = data;
  }

  checkIfOnline(name) {
    const result = _.indexOf(this.onlineUsers, name);
    if (result > -1) {
      return true;
    } else {
      return false;
    }
  }

  // view user
  viewUser(user) {
    this.router.navigate([user.username]);
    if (this.loggedInUser.username !== user.username) {
      this.userService.ProfileNotification(user._id).subscribe(
        data => {
          this.socket.emit('refresh', {});
          console.log(data);
        },
        err => console.log(err)
      );
    }
  }
}
