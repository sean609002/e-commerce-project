import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{
  products: Product[] = [];
  
  currentCategoryId : number = 1;
  //dependency injection
  constructor(private productService : ProductService,
              private route : ActivatedRoute
  ){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    const hasCategoryId = this.route.snapshot.paramMap.has('id')!
    if(hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {this.products = data;}
    )
  }

}
