import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BaseUrl = 'http://localhost:3000/api/chatApp';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get(`${BaseUrl}/users`);
  }

  // Follow user
  followUser(id): Observable<any> {
    return this.http.post(`${BaseUrl}/follow-user`, { userFollowed: id });
  }

  getUserById(id): Observable<any> {
    return this.http.get(`${BaseUrl}/users/${id}`);
  }

  getUserByName(username): Observable<any> {
    return this.http.get(`${BaseUrl}/username/${username}`);
  }

  // unfollow User
  unfollowUser(userFollowed): Observable<any> {
    return this.http.post(`${BaseUrl}/unfollow-user`, { userFollowed });
  }

  // markNotification
  MarkNotification(id, deleteVal?): Observable<any> {
    return this.http.post(`${BaseUrl}/mark/${id}`, { id, deleteVal });
  }

  // MarkAllAsRead
  markAllAsRead(): Observable<any> {
    return this.http.post(`${BaseUrl}/mark-all`, {
      all: true
    });
  }
}

// getAllUsers() {
//   return await this.http.get(`${BaseUrl}/users`);
// }
