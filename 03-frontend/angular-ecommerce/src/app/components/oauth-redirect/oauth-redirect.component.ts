import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/member-services/auth.service';
import { UserService } from '../../services/member-services/user.service';
import { StorageService } from '../../services/member-services/storage.service';

@Component({
  selector: 'app-oauth-redirect',
  templateUrl: './oauth-redirect.component.html',
  styleUrl: './oauth-redirect.component.css'
})
export class OauthRedirectComponent implements OnInit{
  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService
              , private userService: UserService, private storageService: StorageService
  ){}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const acc = params['acc'];
      const ref = params['ref'];
      this.authService.getTokenByQueryString(acc, ref).subscribe(
        (successMsg) => {
          this.handleOAuthLogin();
          this.router.navigateByUrl('products');
        },
        (error) => {
          this.router.navigateByUrl('login');
        }
      );
    }); 
  }

  handleOAuthLogin() {
    this.userService.getUserByAccessToken().subscribe((data: any) => {
      this.storageService.saveUser(data);
      //觸發subject event
      this.storageService.userEmit();
    });
  }

}
