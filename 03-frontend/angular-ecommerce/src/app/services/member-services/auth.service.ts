import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private AUTH_API = 'http://localhost:8080/api/auth/';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) {}

  //dynamically add withCredentials property to httpOptions
  private getHttpOptions(isLoginOrLogout: boolean = false): any {
    return isLoginOrLogout
      ? { ...this.httpOptions, withCredentials: true }
      : this.httpOptions;
  }

  login(username: string, password: string): Observable<any> {
    const signInUrl = this.AUTH_API + 'signin';
    return this.httpClient.post(
      signInUrl,
      {
        username,
        password,
      },
      this.getHttpOptions(true)
    );
  }

  register(firstName: string, lastName: string, username: string, email: string, password: string): Observable<any> {
    const signUpUrl = this.AUTH_API + 'signup';
    return this.httpClient.post(
      signUpUrl,
      {
        firstName,
        lastName,
        username,
        email,
        password,
      },
      this.getHttpOptions()
    );
  }

  logout(): Observable<any> {
    const signOutUrl = this.AUTH_API + 'signout';
    return this.httpClient.post(signOutUrl, { }, this.getHttpOptions(true));
  }

  refreshToken() {
    const  refreshTokenUrl = this.AUTH_API + 'refreshtoken';
    return this.httpClient.post(refreshTokenUrl, { }, this.getHttpOptions(true));
  }
}
