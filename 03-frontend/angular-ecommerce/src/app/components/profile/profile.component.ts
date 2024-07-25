import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/member-services/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShopValidators } from '../../validators/shop-validators';
import { UserService } from '../../services/member-services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  currentUser: any;
  profileFormGroup!: FormGroup;
  isSuccessful: boolean = false;
  isUpdateFailed: boolean = false;
  errorMessage: String = '';

  constructor(private storageService: StorageService, private userService: UserService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
    this.profileFormGroup = this.formBuilder.group({
      firstName: [this.currentUser.firstName,[Validators.required, ShopValidators.notOnlyWhitespace]],
      lastName: [this.currentUser.lastName,[Validators.required, ShopValidators.notOnlyWhitespace]],
      username: [this.currentUser.username,[Validators.required, ShopValidators.notOnlyWhitespace, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['',[Validators.required, ShopValidators.notOnlyWhitespace, Validators.minLength(6), Validators.maxLength(40)]],
      email: [this.currentUser.email,[Validators.required, ShopValidators.notOnlyWhitespace, Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+')]]
    });
  }

  onSubmit() {
    //to display error messages
    if(this.profileFormGroup.invalid) {
      this.profileFormGroup.markAllAsTouched();
      return;
    }

    const id = this.currentUser.id;
    const {firstName, lastName, username, email, password } =this.profileFormGroup.value;

    this.userService.updateUser(id, firstName, lastName, username, email, password).subscribe({
      next: data => {
        this.isSuccessful = true;
        this.isUpdateFailed = false;
        this.storageService.saveUser(data);
        new Promise(resolve => setTimeout(resolve, 1000))
            .then(() => {
              console.log('Navigating to products page...');
              this.router.navigate(['/products']);
            });
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isUpdateFailed = true;
      }
    });
  }

  get firstName() {return this.profileFormGroup.get('firstName');}
  get lastName() {return this.profileFormGroup.get('lastName');}
  get userName() {return this.profileFormGroup.get('username');}
  get email() {return this.profileFormGroup.get('email');}
  get password() {return this.profileFormGroup.get('password');}
}
