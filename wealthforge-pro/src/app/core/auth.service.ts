import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';

type Role = 'INVESTOR' | 'ADVISOR' | 'ADMIN';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authBase = 'http://localhost:8080';

  constructor(private readonly http: HttpClient) {}

  login(payload: LoginPayload): Observable<{ token: string }> {
    return this.http.post<any>(`${this.authBase}/api/auth/login`, payload).pipe(
      map((res) => this.extractToken(res)),
      catchError(() => this.http.post<any>(`${this.authBase}/auth/login`, payload).pipe(map((res) => this.extractToken(res))))
    );
  }

  register(payload: RegisterPayload): Observable<unknown> {
    return this.http.post(`${this.authBase}/api/auth/register`, payload).pipe(
      catchError(() => this.http.post(`${this.authBase}/auth/register`, payload))
    );
  }

  private extractToken(response: any): { token: string } {
    const token = response?.token || response?.jwt || response?.accessToken || response?.data?.token;
    if (!token) {
      throw new Error('Token not found in login response.');
    }
    return { token };
  }
}
