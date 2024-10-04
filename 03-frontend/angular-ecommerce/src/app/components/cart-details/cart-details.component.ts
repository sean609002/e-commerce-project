import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { StorageService } from '../../services/member-services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent implements OnInit, OnDestroy{
  cartItems : CartItem[] = [];
  totalPrice : number = 0;
  totalQuantity : number = 0;
  private totalPriceSubscription?: Subscription;
  private totalQuantitySubscription?: Subscription;
  user: any;

  constructor(private router:Router, private cartService : CartService, private storageService: StorageService){}

  ngOnInit(): void {
    this.storageService.user.subscribe(user => {
      this.user = user;
    });
    this.listCartDetails();
  }

  onClick() {
    if (this.user != undefined) {
      this.router.navigate(['/checkout']);
    } else {
      alert('請先登錄以繼續操作');
      this.router.navigate(['/login']);
    }
  }

  listCartDetails() {
    this.cartItems = this.cartService.cartItems;

    this. totalPriceSubscription = this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this. totalQuantitySubscription = this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    //when the cart icon is clicked, CartDetailsComponent is instantiated
    //however,this.totalPrice and this.totalQuantity has nothing
    //because when cartService sent the events, instance of this class does not exist
    //so we have to call this method to ask carService to send the events
    //original Subject instance in CartService is changed into BehaviorSubject instance
    //so there's no need to call this method
    //this.cartService.computeCartTotals();
  }

  incrementQuantity(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
  }

  decrementQuantity(cartItem: CartItem) {
    this.cartService.decrementQuantity(cartItem);
  }

  remove(cartItem: CartItem) {
    this.cartService.remove(cartItem);
  }

  ngOnDestroy(): void {
    this.totalPriceSubscription?.unsubscribe();
    this.totalQuantitySubscription?.unsubscribe();
  }
}
