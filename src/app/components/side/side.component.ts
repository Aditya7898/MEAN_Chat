import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { TokenService } from '../../services/token.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.css']
})
export class SideComponent implements OnInit {
  socket: any;
  user: any;
  userData: any;

  constructor(
    private userService: UsersService,
    private tokenService: TokenService
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
    this.userService.getUserById(this.user._id).subscribe(data => {
      this.userData = data.result;
    });
  }
}
