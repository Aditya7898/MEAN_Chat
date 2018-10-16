import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { UsersService } from '../../services/users.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {
  following = [];
  user: any;
  socket: any;

  constructor(
    private tokenService: TokenService,
    private userService: UsersService
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.getPayload();
    this.getUser();
    this.socket.on('refreshPage', () => {
      this.getUser();
    });
  }

  getUser() {
    this.userService.getUserById(this.user._id).subscribe(
      data => {
        this.following = data.result.following;
        console.log(data);
      },
      err => console.log(err)
    );
  }

  unFollow(user) {
    console.log(user);
    this.userService.unfollowUser(user._id).subscribe(data => {
      console.log(data);
      this.socket.emit('refresh', {});
    });
  }
}
