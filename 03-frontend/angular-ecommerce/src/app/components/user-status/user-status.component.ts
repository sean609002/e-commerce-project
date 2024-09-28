import { Component, OnDestroy, OnInit } from '@angular/core';
import { StorageService } from '../../services/member-services/storage.service';
import { AuthService } from '../../services/member-services/auth.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RefreshTokenService } from '../../services/member-services/refresh-token.service';

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrl: './user-status.component.css'
})
export class UserStatusComponent implements OnInit, OnDestroy{
  isLoggedIn = false;
  username?: string;
  private logInSubscription?: Subscription;
  private tokenExpireSubscription?: Subscription;

  constructor(private storageService: StorageService, private authService: AuthService, 
              private location: Location, private route: ActivatedRoute, private refreshTokenService: RefreshTokenService,
              private router: Router) { }

  ngOnInit(): void {
    //訂閱已接收最新logInStatus
    this.logInSubscription = this.storageService.loggedInStatus.subscribe(
      status => {
        this.isLoggedIn = status;
      }
    );
    //觸發subject event
    this.storageService.isLoggedIn();
    
    //如果已經登入，就設置username
    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.username = user.username;
    }
    //如果還沒登入，使用者要先登入，而我們透過監聽URL變化來設置username
    this.location.onUrlChange(
      () => {
        const user = this.storageService.getUser();
        if(user) {
          this.username = user.username;
        }
      }
    );
    //refresh token過期，則登出
    this.tokenExpireSubscription = this.refreshTokenService.on('logout', () => {
      alert('session expired. please login');
      this.router.navigateByUrl('/products');
      this.logout();
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.storageService.clean();

        window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }

  ngOnDestroy(): void {
    this.logInSubscription?.unsubscribe();
    this.tokenExpireSubscription?.unsubscribe();
  }
}
