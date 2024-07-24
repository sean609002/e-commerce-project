import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/member-services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShopValidators } from '../../validators/shop-validators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  registerFormGroup! : FormGroup;

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.registerFormGroup = this.formBuilder.group({
      firstName: ['',[Validators.required, ShopValidators.notOnlyWhitespace]],
      lastName: ['',[Validators.required, ShopValidators.notOnlyWhitespace]],
      username: ['',[Validators.required, ShopValidators.notOnlyWhitespace, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['',[Validators.required, ShopValidators.notOnlyWhitespace, Validators.minLength(6), Validators.maxLength(40)]],
      email: ['',[Validators.required, ShopValidators.notOnlyWhitespace, Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+')]]
    });
  }

  onSubmit(): void {
    //to display error messages
    if(this.registerFormGroup.invalid) {
      this.registerFormGroup.markAllAsTouched();
      return;
    }

    const {firstName, lastName, username, email, password } =this.registerFormGroup.value;

    this.authService.register(firstName, lastName, username, email, password).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        new Promise(resolve => setTimeout(resolve, 1000))
            .then(() => {
              console.log('Navigating to products page...');
              this.router.navigate(['/products']);
            });
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
  
  get firstName() {return this.registerFormGroup.get('firstName');}
  get lastName() {return this.registerFormGroup.get('lastName');}
  get userName() {return this.registerFormGroup.get('username');}
  get email() {return this.registerFormGroup.get('email');}
  get password() {return this.registerFormGroup.get('password');}
}
