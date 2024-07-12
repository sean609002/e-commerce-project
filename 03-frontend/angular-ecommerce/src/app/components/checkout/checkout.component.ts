import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShopFormService } from '../../services/shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { ShopValidators } from '../../validators/shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{
  checkoutFormGroup! : FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  
  
  constructor(private formBuilder: FormBuilder, private shopFormService: ShopFormService){}

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: ['', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]],
        lastName: ['', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]],
        email: ['',[Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]]
      }),
      shippingAddress : this.formBuilder.group({
        street: ['', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]],
        city: ['', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]],
        country: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]]
      }),
      billingAddress : this.formBuilder.group({
        street: ['', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]],
        city: ['', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]],
        country: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]]
      }),
      creditCard : this.formBuilder.group({
        cardType: ['', [Validators.required]],
        nameOnCard: ['', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]],
        cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$'), ShopValidators.luhnCheck]],
        securityCode: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
        expirationMonth: [''],
        expirationYear: ['']
      }, {validator: ShopValidators.cardTypeMatchCardNumber})
    });

    //get creditCardYears and creditCardMonths from shopFormService
    const startMonth: number = new Date().getMonth() + 1;
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
    });

    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
      }
    );

    //populate countries
    this.shopFormService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    );

    this.detectCardType();
  }

  ngOnSubmit() {
    //to display error messages
    if(this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
  }

  copyShippingAddressToBillingAddress(event : any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
            .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      //bug fix for states
      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }
  
  //if user selects an expiration year different from current year, we should make
  //expiration months go from 1 to 12
  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup!.value.expirationYear);


    let startMonth: number;
    if(currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
    });
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup!.value.country.code;

    this.shopFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName == 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        //set default state
        formGroup!.get('state')!.setValue(data[0]);
      }
    )
  }

  //return formControl instance for validation purpose in HTML
  get firstName() {return this.checkoutFormGroup.get('customer.firstName');}
  get lastName() {return this.checkoutFormGroup.get('customer.lastName');}
  get email() {return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressStreet() {return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity() {return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressCountry() {return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingAddressState() {return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressZipCode() {return this.checkoutFormGroup.get('shippingAddress.zipCode');}

  get billingAddressStreet() {return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity() {return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressCountry() {return this.checkoutFormGroup.get('billingAddress.country');}
  get billingAddressState() {return this.checkoutFormGroup.get('billingAddress.state');}
  get billingAddressZipCode() {return this.checkoutFormGroup.get('billingAddress.zipCode');}

  get creditCardType() {return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardName() {return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber() {return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode() {return this.checkoutFormGroup.get('creditCard.securityCode');}
  get creditCardForm() {return this.checkoutFormGroup.get('creditCard');}
  //dynamically changes cardType based on cardNumber
  detectCardType(): void {
    this.checkoutFormGroup
      .get('creditCard.cardNumber')
      ?.valueChanges.subscribe((cardNumber) => {
        let cardType = this.checkoutFormGroup.get('creditCard.cardType');

        if (/^4[0-9]{6,}$/.test(cardNumber)) {
          cardType?.setValue('Visa');
        } else if (/^5[1-5][0-9]{5,}|222[1-9][0-9]{3,}|22[3-9][0-9]{4,}|2[3-6][0-9]{5,}|27[01][0-9]{4,}|2720[0-9]{3,}$/.test(cardNumber)) {
          cardType?.setValue('MasterCard');
        } else if (/^3[47][0-9]{5,}$/.test(cardNumber)) {
          cardType?.setValue('American Express');
        }
      });
  }
}
