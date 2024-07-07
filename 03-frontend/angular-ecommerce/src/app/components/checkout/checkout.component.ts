import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{
  checkoutFormGroup! : FormGroup;
  totalPrice : number = 0;
  totalQuantity : number = 0;
  

  constructor(private formBuilder : FormBuilder){}

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer : this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress : this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        zipCode: ['']
      }),
      billingAddress : this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        zipCode: ['']
      }),
      creditCard : this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    })
  }

  ngOnSubmit() {

  }

  copyShippingAddressToBillingAddress(event : any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
            .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }
  
}
