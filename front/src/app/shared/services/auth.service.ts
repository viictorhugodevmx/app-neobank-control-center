import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthUser, LoginApiResponse, LoginFormValue } from '../../features/auth/models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  login(payload: LoginFormValue): Observable<AuthUser> {
    return this.http
      .post<LoginApiResponse>(`${this.apiUrl}/auth/login`, payload)
      .pipe(
        tap((response) => {
          localStorage.setItem('nb_token', response.data.token);
          localStorage.setItem('nb_user', JSON.stringify(response.data.user));
        }),
        map((response) => response.data.user)
      );
  }

  logout(): void {
    localStorage.removeItem('nb_token');
    localStorage.removeItem('nb_user');
  }

  getToken(): string | null {
    return localStorage.getItem('nb_token');
  }

  getUser(): AuthUser | null {
    const rawUser = localStorage.getItem('nb_user');

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as AuthUser;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }
}
