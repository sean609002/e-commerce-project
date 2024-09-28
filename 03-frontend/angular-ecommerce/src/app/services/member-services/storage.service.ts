import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private USER_KEY = 'auth-user';
  loggedInStatus = new BehaviorSubject<boolean>(false);
  constructor() {}

  clean(): void {
    window.sessionStorage.clear();
    this.isLoggedIn();
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(this.USER_KEY);
    window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(this.USER_KEY);
    if (user) {

      return JSON.parse(user);
    }

    return {};
  }

  public isLoggedIn() {
    const user = window.sessionStorage.getItem(this.USER_KEY);
    if (user) {
      this.loggedInStatus.next(true);
    } else {
      this.loggedInStatus.next(false);
    }
  }
}
