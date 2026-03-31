import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Post[]> {
    return this.http.get<Post[]>(API_ENDPOINTS.posts);
  }

  getById(id: number): Observable<Post> {
    return this.http.get<Post>(`${API_ENDPOINTS.posts}/${id}`);
  }

  getByUserId(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${API_ENDPOINTS.posts}/user/${userId}`);
  }

  searchByTitle(title: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${API_ENDPOINTS.posts}/search?title=${title}`);
  }

  create(post: Post): Observable<Post> {
    return this.http.post<Post>(API_ENDPOINTS.posts, post);
  }

  update(id: number, post: Post): Observable<Post> {
    return this.http.put<Post>(`${API_ENDPOINTS.posts}/${id}`, post);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.posts}/${id}`);
  }
}