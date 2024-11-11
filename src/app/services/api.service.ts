import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<User[] | null> {
    return this.http.get<{ users: User[] }>(this.baseUrl)
      .pipe(
        map(response => {
          const users = response.users.filter(user => user.username === username && user.password === password);
          console.log('Filtered Users:', users);
          return users.length > 0 ? users : null;
        }),
        catchError(this.handleError)
      );
  }

  getMenus(): Observable<Menu[]> {
    return this.http.get<{ menus: Menu[] }>(this.baseUrl).pipe(
      map(response => response.menus),
      catchError(this.handleError)
    );
  }

  getSubMenus(): Observable<SubMenu[]> {
    return this.http.get<{ submenus: SubMenu[] }>(this.baseUrl).pipe(
      map(response => response.submenus),
      catchError(this.handleError)
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<{ users: User[] }>(this.baseUrl).pipe(
      map(response => response.users),
      catchError(this.handleError)
    );
  }

  addUser(user: User): Observable<User> {
    // Since this is a static JSON file, POST requests won't actually work.
    // This is just a placeholder to show how it would be done with a real API.
    return this.http.post<User>(`${this.baseUrl}/users`, user).pipe(
      catchError(this.handleError)
    );
  }

  editUser(id: number, user: User): Observable<User> {
    // Since this is a static JSON file, PUT requests won't actually work.
    // This is just a placeholder to show how it would be done with a real API.
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<void> {
    // Since this is a static JSON file, DELETE requests won't actually work.
    // This is just a placeholder to show how it would be done with a real API.
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`).pipe(
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
  menu: number[];
  submenu: number[];
}

interface Menu {
  menuId: number;
  menuName: string;
  menuImage: string;
}

interface SubMenu {
  submenuId: number;
  submenuName: string;
  submenuImage: string;
  menuId: number;
}
