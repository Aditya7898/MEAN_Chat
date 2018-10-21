import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { TokenService } from '../../services/token.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  user: any;
  receiver: string;
  receiverData: any;
  message: string;

  constructor(
    private messageService: MessageService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private userService: UsersService
  ) {}

  ngOnInit() {
    this.user = this.tokenService.getPayload();
    this.route.params.subscribe(params => {
      this.receiver = params.name;
      this.GetUserByUserName(this.receiver);
    });
  }

  GetUserByUserName(name) {
    this.userService.getUserByName(name).subscribe(data => {
      this.receiverData = data.result;
      console.log(this.receiverData._id, this.receiverData.username);
    });
  }

  sendMessage() {
    console.log('clicked');
    if (this.message) {
      console.log(this.message);
      this.messageService
        .sendMessage(
          this.user._id,
          this.receiverData._id,
          this.receiverData.username,
          this.message
        )
        .subscribe(res => {
          console.log(res);
          this.message = '';
        });
    } else {
      console.log('else');
    }
  }
}
