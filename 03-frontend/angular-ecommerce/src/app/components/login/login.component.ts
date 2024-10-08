import { environment } from './../../../environments/environment.development';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/member-services/auth.service';
import { StorageService } from '../../services/member-services/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShopValidators } from '../../validators/shop-validators';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy{
  loginFormGroup!: FormGroup;
  isLoginFailed = false;
  errorMessage = '';
  private userSubscription?: Subscription;
  authUrl = environment.oauthUrl;
  user: any;

  constructor(private authService: AuthService, private storageService: StorageService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.userSubscription = this.storageService.user.subscribe((data) => {
      this.user = data;
    });

    this.loginFormGroup = this.formBuilder.group({
      username: ['',[Validators.required, ShopValidators.notOnlyWhitespace, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['',[Validators.required, ShopValidators.notOnlyWhitespace, Validators.minLength(6), Validators.maxLength(40)]]
    });
  }

  onSubmit(): void {
    //to display error messages
    if(this.loginFormGroup.invalid) {
      this.loginFormGroup.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginFormGroup.value;

    this.authService.login(username, password).subscribe({
      next: data => {
        this.storageService.saveUser(data);

        this.isLoginFailed = false;
        //觸發subject event
        this.storageService.userEmit();
        new Promise(resolve => setTimeout(resolve, 1000))
            .then(() => {
              console.log('Navigating to products page...');
              this.router.navigate(['/products']);
            });
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  get userName() {return this.loginFormGroup?.get('username');}
  get password() {return this.loginFormGroup?.get('password');}
}
