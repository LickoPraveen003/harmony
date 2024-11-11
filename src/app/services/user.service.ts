import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.baseUrl}/users`)
      .pipe(
        map(users => {
          const user = users.find(user => user.username === username && user.password === password);
          console.log('Filtered User:', user);
          return user ? user : null;
        }),
        catchError(this.handleError)
      );
  }

  getMenus(): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${this.baseUrl}/menus`).pipe(
      catchError(this.handleError)
    );
  }

  // getLogo(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.baseUrl}/logo`).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`).pipe(
      catchError(this.handleError)
    );
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/AddUser`, user).pipe(
    // return this.http.post<User>(`${this.baseUrl}/users`, user).pipe(
      catchError(this.handleError)
    );
  }

  editUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/DeleteUser/${id}`).pipe(
    // return this.http.delete<void>(`${this.baseUrl}/users/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something went wrong; please try again later.';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.error instanceof ProgressEvent) {
        errorMessage = 'Network error or CORS issue';
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    console.error('An error occurred:', errorMessage);
    return throwError(errorMessage);
  }
}

interface User {
  id?: string;
  username: string;
  password: string;
  menu: { menuId: string; menuName: string; isactive: boolean; menuURL: string }[];
}

interface Menu {
  menuId: string;
  menuName: string;
  menuImage: string;
}
