import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.css'
})
export class CartStatusComponent implements OnInit, OnDestroy{
  totalPrice : number = 0;
  totalQuantity : number = 0;
  private totalPriceSubscription?: Subscription;
  private totalQuantitySubscription?: Subscription;

  constructor(private cartService : CartService){}

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus() {
    this.totalPriceSubscription = this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this.totalQuantitySubscription = this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

  ngOnDestroy(): void {
    this.totalPriceSubscription?.unsubscribe();
    this.totalQuantitySubscription?.unsubscribe();
  }

}
