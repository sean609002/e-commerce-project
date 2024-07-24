import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/member-services/storage.service';
import { AuthService } from '../../services/member-services/auth.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrl: './user-status.component.css'
})
export class UserStatusComponent implements OnInit{
  isLoggedIn = false;
  username?: string;

  constructor(private storageService: StorageService, private authService: AuthService, private location: Location, private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log('user-status oninit');
    //訂閱已接收最新logInStatus
    this.storageService.loggedInStatus.subscribe(
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
        if(user && !this.username) {
          this.username = user.username;
        }
      }
    );
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
}
