import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const BaseUrl = 'http://localhost:3000/api/chatapp';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient) {}

  addPost(body): Observable<any> {
    return this.http.post(`${BaseUrl}/post/add-post`, body);
  }

  getAllPosts(): Observable<any> {
    return this.http.get(`${BaseUrl}/posts`);
  }

  addLike(body): Observable<any> {
    return this.http.post(`${BaseUrl}/post/add-like`, body);
  }

  addComment(postId, comment): Observable<any> {
    return this.http.post(`${BaseUrl}/post/add-comment`, { postId, comment });
  }

  getPost(id): Observable<any> {
    return this.http.get(`${BaseUrl}/post/${id}`);
  }
}
