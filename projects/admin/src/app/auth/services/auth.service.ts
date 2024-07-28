import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { environment } from 'projects/admin/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authToken: string | null = null;

  constructor(private http: HttpClient) {}

  public register(user: any): Observable<any> {
    return this.http.post<any>(environment.baseApi + 'Auth/register', user);
  }

  public login(user: any): Observable<any> {
    return this.http.post<any>(environment.baseApi + 'Auth/login', user);
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }
}
