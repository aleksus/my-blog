import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserAuth, UserRegister } from '../models/user.model';
import { API_ENDPOINTS } from '../constants/api.constants';

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

  authenticate(user: UserAuth): Observable<User> {
    return this.http.post<User>(`${API_ENDPOINTS.users}/authenticate`, user);
  }

  create(user: UserRegister): Observable<User> {
    return this.http.post<User>(API_ENDPOINTS.users, user);
  }

  update(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${API_ENDPOINTS.users}/${id}`, user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.users}/${id}`);
  }
}
