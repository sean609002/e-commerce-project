import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/member-services/auth.service';
import { StorageService } from '../../services/member-services/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShopValidators } from '../../validators/shop-validators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginFormGroup!: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  

  constructor(private authService: AuthService, private storageService: StorageService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    //訂閱已接收最新的logInStatus
    this.storageService.loggedInStatus.subscribe(
      status => {
        this.isLoggedIn = status;
      }
    );
    //觸發subject event
    this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      this.roles = this.storageService.getUser().roles;
    }

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
        this.storageService.isLoggedIn();
        this.roles = this.storageService.getUser().roles;
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


  get userName() {return this.loginFormGroup?.get('username');}
  get password() {return this.loginFormGroup?.get('password');}
}
