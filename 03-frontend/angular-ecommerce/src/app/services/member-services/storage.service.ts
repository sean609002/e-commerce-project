import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private USER_KEY = 'auth-user';
  user = new BehaviorSubject<any>(undefined);
  constructor() {}

  clean(): void {
    window.sessionStorage.clear();
    this.userEmit();
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(this.USER_KEY);
    window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  public userEmit(): any {
    this.user.next(this.getUser());
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(this.USER_KEY);
    if (user) {

      return JSON.parse(user);
    }

    return undefined;
  }
}
