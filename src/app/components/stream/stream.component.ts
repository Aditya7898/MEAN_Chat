import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import * as M from 'materialize-css';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.css']
})
export class StreamComponent implements OnInit {
  token: any;
  streamsTab = false;
  topStreamsTab = false;
  constructor(private tokenService: TokenService) {}

  ngOnInit() {
    this.streamsTab = true;
    this.token = this.tokenService.getPayload();
    console.log(this.token);
    //
    const tabs = document.querySelector('.tabs');
    M.Tabs.init(tabs, {});
  }

  changeTabs(value) {
    console.log(value);
    if (value === 'streams') {
      this.streamsTab = true;
      this.topStreamsTab = false;
    }
    if (value === 'top') {
      this.streamsTab = false;
      this.topStreamsTab = true;
    }
  }
}
