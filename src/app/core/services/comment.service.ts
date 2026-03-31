import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Comment[]> {
    return this.http.get<Comment[]>(API_ENDPOINTS.comments);
  }

  getByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${API_ENDPOINTS.comments}/post/${postId}`);
  }

  create(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(API_ENDPOINTS.comments, comment);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.comments}/${id}`);
  }
}