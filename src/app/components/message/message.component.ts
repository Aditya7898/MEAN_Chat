import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { MessageService } from '../../services/message.service';
import { TokenService } from '../../services/token.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
import io from 'socket.io-client';
import { CaretEvent, EmojiEvent } from 'ng2-emoji-picker';
import _ from 'lodash';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, AfterViewInit, OnChanges {
  @Input()
  users;

  //
  public eventMock;
  public eventPosMock;

  public direction =
    Math.random() > 0.5
      ? Math.random() > 0.5
        ? 'top'
        : 'bottom'
      : Math.random() > 0.5
        ? 'right'
        : 'left';
  public toggled = false;
  public content = '  ';

  private _lastCaretEvent: CaretEvent;
  // ^^

  user: any;
  socket: any;
  receiver: string;
  receiverData: any;
  message: string;
  messagesArray = [];
  typingMessage;
  typing = false;
  IsOnline = false;

  constructor(
    private messageService: MessageService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private userService: UsersService
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngAfterViewInit() {
    const params = {
      room1: this.user.username,
      room2: this.receiver
    };
    this.socket.emit('join chat', params);
  }

  ngOnChanges(changes: SimpleChanges) {
    const title = document.querySelector('.nameCol');
    if (changes.users.currentValue.length > 0) {
      const result = _.indexOf(changes.users.currentValue, this.receiver);
      if (result > -1) {
        this.IsOnline = true;
        (title as HTMLElement).style.marginTop = '10px';
      } else {
        this.IsOnline = false;
        (title as HTMLElement).style.marginTop = '20px';
      }
    }
  }

  ngOnInit() {
    this.user = this.tokenService.getPayload();
    this.route.params.subscribe(params => {
      this.receiver = params.name;
      this.GetUserByUserName(this.receiver);
      //
      this.socket.on('refreshPage', () => {
        this.GetUserByUserName(this.receiver);
      });
    });

    //  typing
    this.socket.on('is_typing', data => {
      if (data.sender === this.receiver) {
        this.typing = true;
      }
    });

    this.socket.on('has_stopped_typing', data => {
      if (data.sender === this.receiver) {
        this.typing = false;
      }
    });
  }

  // get user by name
  GetUserByUserName(name) {
    this.userService.getUserByName(name).subscribe(data => {
      this.receiverData = data.result;
      this.GetMessages(this.user._id, data.result._id);
      console.log(this.receiverData._id, this.receiverData.username);
    });
  }

  // message sending
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
          this.socket.emit('refresh', {});
          this.message = '';
        });
    } else {
      console.log('else');
    }
  }

  // GetAllMessages()
  GetMessages(senderId, receiverId) {
    this.messageService.GetAllMessages(senderId, receiverId).subscribe(res => {
      this.messagesArray = res.messages.message;
    });
  }

  //
  IsTyping() {
    console.log('Is typing a message');
    this.socket.emit('start_typing', {
      sender: this.user.username,
      receiver: this.receiver
    });
    if (this.typingMessage) {
      clearTimeout(this.typingMessage);
    }
    this.typingMessage = setTimeout(() => {
      this.socket.emit('stop_typing', {
        sender: this.user.username,
        receiver: this.receiver
      });
    }, 3500);
  }

  // emoji picker methods
  handleSelection(event: EmojiEvent) {
    this.content =
      this.content.slice(0, this._lastCaretEvent.caretOffset) +
      event.char +
      this.content.slice(this._lastCaretEvent.caretOffset);
    this.eventMock = JSON.stringify(event);

    // console.log(this.content);
    this.message = this.content;
    this.content = '';
    this.toggled = !this.toggled;
  }

  handleCurrentCaret(event: CaretEvent) {
    this._lastCaretEvent = event;
    this.eventPosMock = `{ caretOffset : ${
      event.caretOffset
    }, caretRange: Range{...}, textContent: ${event.textContent} }`;
  }

  Toggled() {
    this.toggled = !this.toggled;
  }
}
