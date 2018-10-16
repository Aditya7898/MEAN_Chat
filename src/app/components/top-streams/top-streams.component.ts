import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-streams',
  templateUrl: './top-streams.component.html',
  styleUrls: ['./top-streams.component.css']
})
export class TopStreamsComponent implements OnInit {
  topPosts: any;
  socket: any;
  user: any;

  constructor(
    private postService: PostService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.getPayload();
    this.AllPosts();
    this.socket.on('refreshPage', data => {
      this.AllPosts();
    });
  }

  AllPosts() {
    this.postService.getAllPosts().subscribe(
      data => {
        this.topPosts = data.top;
      },
      err => {
        if (err.error.token === null) {
          this.tokenService.deleteToken();
          this.router.navigate(['']);
        }
      }
    );
  }

  TimeFromNow(time) {
    return moment(time).fromNow();
  }

  checkInLikesArray(arr, username) {
    return _.some(arr, { username: username });
  }

  LikePost(post) {
    this.postService.addLike(post).subscribe(
      data => {
        this.socket.emit('refresh', {});
      },
      err => {
        console.log(err);
      }
    );
    console.log(post);
  }

  openCommentBox(post) {
    this.router.navigate(['post', post._id]);
  }
}
