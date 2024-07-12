import { AbstractControl, FormControl, ValidationErrors } from "@angular/forms";

export class ShopValidators {
    static notOnlyWhitespace(control: FormControl): ValidationErrors | null {
        //check if the value is just a couple of spaces
        if((control.value != null) && (control.value.trim().length <= 1)) {
            return {'notOnlyWhitespace': true};
        }
        //valid
        return null;
    }
    
    static luhnCheck(control: FormControl): ValidationErrors | null {
        let value = control.value;
        if (value && typeof value === 'string') {
          let sum = 0;
          let shouldDouble = false;
     
          for (let i = value.length - 1; i >= 0; --i) {
            let digit = parseInt(value.charAt(i), 10);
     
            if (shouldDouble) {
              if ((digit *= 2) > 9) digit -= 9;
            }
     
            sum += digit;
            shouldDouble = !shouldDouble;
          }
     
          if (sum % 10 !== 0) {
            return { luhnCheck: true };
          }
        }
     
        return null;
    }

    static cardTypeMatchCardNumber(control: AbstractControl): ValidationErrors | null {
      //check if the number match the corresponding card type
      const type = control.get('cardType')?.value;
      const number = control.get('cardNumber')?.value;

      const ifMatch = (/^4[0-9]{6,}$/.test(number) && type === 'Visa') ||
                      (/^5[1-5][0-9]{5,}|222[1-9][0-9]{3,}|22[3-9][0-9]{4,}|2[3-6][0-9]{5,}|27[01][0-9]{4,}|2720[0-9]{3,}$/.test(number) && type === 'MasterCard') ||
                      (/^3[47][0-9]{5,}$/.test(number) && type === 'American Express');
      
      if (!ifMatch) {
        return {cardTypeMatchCardNumber: true};
      }
      //valid
      return null;
    }
}
