import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
  updateUser(id: number, user: User): Observable<User> {
    if (!id || id <= 0) {
      throw new Error('ID de User no válido');
    }
    return this.http.put<User>(`${this.apiUrl}/${id}`, { name: user.name });
  }

  deleteUser(id: number): Observable<any> {
    if (!id || id <= 0) {
      throw new Error('ID de User no válido');
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
