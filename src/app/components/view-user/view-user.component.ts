import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as M from 'materialize-css';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
import * as moment from 'moment';
@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit, AfterViewInit {
  tabElements: any;
  postTab = false;
  followingTab = false;
  followersTab = false;

  posts = [];
  following = [];
  followers = [];
  user: any;
  name: any;

  constructor(private route: ActivatedRoute, private userService: UsersService) { }

  ngOnInit() {
    this.postTab = true;
    this.tabElements = document.querySelector('.nav-content');
    const tabs = document.querySelector('.tabs');
    M.Tabs.init(tabs, {});

    this.route.params.subscribe(params => {
      this.name = params.name;
      this.GetUserData(this.name);
    });
  }

  ngAfterViewInit() {
    this.tabElements.style.display = 'none';
  }

  GetUserData(name) {
    this.userService.getUserByName(name).subscribe(data => {
      console.log(data);
      this.user = data.result;
      this.posts = data.result.posts.reverse();
      this.followers = data.result.followers;
      this.following = data.result.following;
    }, err => console.log(err));
  }

  ChangeTab(tab) {
    if (tab === 'post') {
      this.postTab = true;
      this.followingTab = false;
      this.followersTab = false;
    }
    if (tab === 'following') {
      this.postTab = false;
      this.followingTab = true;
      this.followersTab = false;
    }
    if (tab === 'followers') {
      this.postTab = false;
      this.followingTab = false;
      this.followersTab = true;
    }
  }

  TimeFromNow(time) {
    return moment(time).fromNow();
  }
}
