import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{

  product! : Product;

  //dependency injection
  constructor(private productService : ProductService,
              private route : ActivatedRoute,
              private cartService : CartService){}

  ngOnInit(): void {
    //whenever the param value changes, listProducts() will be called
    this.route.paramMap.subscribe(() =>
      this.handleProductDetails()
    )
  }
  handleProductDetails(): void {
    const productId : number = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(productId).subscribe(
      data => {
        this.product = data;
      }
    )
  }
  addToCart() {
    const cartItem : CartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);
  }

}
