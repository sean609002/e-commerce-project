import { CartItem } from './../common/cart-item';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  private storage: Storage = localStorage;

  constructor() { 
    const data = this.storage.getItem('cartItems');
    if(data) {
      this.cartItems = JSON.parse(data);
      this.computeCartTotals();
    }
  }

  addToCart(cartItem: CartItem) {
    let alreadyExistInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;
    //check if there's a carItem whose id is the same as the cartItem passed in
    if(this.cartItems.length > 0) {
      /*make use of instance method called 'find' that each arrays has */
      /*for each items, find function will return one if the call back function returns true*/
      existingCartItem = this.cartItems.find(theCartItem => theCartItem.id == cartItem.id);
      
      //if existingCartItem exists, we set alreadyExistInCart to true
      if(existingCartItem != undefined) {
        alreadyExistInCart = true;
      }
    }
    //if our cartItems already has a cartItem, we make use of it
    if(alreadyExistInCart) {
      existingCartItem!.quantity++;
    } else {
      this.cartItems.push(cartItem);
    }
    this.computeCartTotals();

  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for(let tempCartItem of this.cartItems) {
      totalPriceValue += tempCartItem.quantity * tempCartItem.unitPrice;
      totalQuantityValue += tempCartItem.quantity;
    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    //this.logCartItems(totalPriceValue, totalQuantityValue);
    this.persistCartItems();
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  logCartItems(totalPrice: number, totalQuantity: number) {
    console.log("content of the cart");
    for(let tempCartItem of this.cartItems) {
      console.log(`name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, unitPrice: ${tempCartItem.unitPrice}`);
    }
    console.log(`totalPrice: ${totalPrice}, totalQuantity: ${totalQuantity}`);
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if(cartItem.quantity === 0) {
      this.remove(cartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(cartItem: CartItem) {
    const itemIndex : number = this.cartItems.findIndex(theCartItem => theCartItem.id === cartItem.id);
    
    if(itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

}
