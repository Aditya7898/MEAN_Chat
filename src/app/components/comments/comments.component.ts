import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { ActivatedRoute } from '@angular/router';
import io from 'socket.io-client';
import * as moment from 'moment';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, AfterViewInit {
  toolbarElement: any;
  socket: any;
  commentsArray = [];
  postId: any;
  commentForm: FormGroup;
  post: string;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private route: ActivatedRoute
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.toolbarElement = document.querySelector('.nav-content');
    this.postId = this.route.snapshot.paramMap.get('id');
    this.init();
    this.getPost();
    this.socket.on('refreshPage', data => {
      this.getPost();
    });
  }
  ngAfterViewInit() {
    this.toolbarElement.style.display = 'none';
  }

  init() {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });
  }

  AddComment() {
    console.log(this.commentForm.value);
    this.postService
      .addComment(this.postId, this.commentForm.value.comment)
      .subscribe(data => {
        console.log(data);
      });
    this.commentForm.reset();
    this.socket.emit('refresh', {});
  }

  getPost() {
    this.postService.getPost(this.postId).subscribe(data => {
      this.post = data.post.post;
      console.log(data);
      this.commentsArray = data.post.comments.reverse();
    });
  }

  TimeFromNow(time) {
    return moment(time).fromNow();
  }
}
