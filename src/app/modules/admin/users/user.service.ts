import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../enviroments/environment';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl+'/users';

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
    // Enviar todo el objeto de usuario en la solicitud PUT
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    if (!id || id <= 0) {
      throw new Error('ID de User no válido');
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchUser(searchValue: string): Observable<any[]> {
    // Construye la URL de la solicitud aquí con `searchValue`
    const url = `${this.apiUrl}/search?name=${encodeURIComponent(searchValue)}`;
    
    return this.http.get<any[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    // Puedes mejorar el log de errores aquí
    console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    // TODO: Mejorar el manejo de errores dependiendo de tu aplicación
    return throwError('Something bad happened; please try again later.');
  }
}
