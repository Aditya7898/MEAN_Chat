import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
const BaseUrl = 'http://localhost:3000/api/chatapp';
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private http: HttpClient) {}

  sendMessage(sender_Id, receiver_Id, receivername, message): Observable<any> {
    return this.http.post(
      `${BaseUrl}/chat-messages/${sender_Id}/${receiver_Id}`,
      {
        receiver_Id,
        receivername,
        message
      }
    );
  }
}
