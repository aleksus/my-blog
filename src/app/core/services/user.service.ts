import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(API_ENDPOINTS.users);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${API_ENDPOINTS.users}/${id}`);
  }

  authenticate(user: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_ENDPOINTS.users}/authenticate`, user);
  }

  create(user: RegisterRequest): Observable<User> {
    return this.http.post<User>(API_ENDPOINTS.users, user);
  }

  update(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${API_ENDPOINTS.users}/${id}`, user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.users}/${id}`);
  }
}
