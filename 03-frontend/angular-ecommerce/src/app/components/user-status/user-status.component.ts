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
  private userSubscription?: Subscription;
  private tokenExpireSubscription?: Subscription;
  user: any;

  constructor(private storageService: StorageService, private authService: AuthService, 
              private location: Location, private route: ActivatedRoute, private refreshTokenService: RefreshTokenService,
              private router: Router) { }

  ngOnInit(): void {
    this.userSubscription = this.storageService.user.subscribe((data) => {
      this.user = data;
    });

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
    this.userSubscription?.unsubscribe();
    this.tokenExpireSubscription?.unsubscribe();
  }
}
