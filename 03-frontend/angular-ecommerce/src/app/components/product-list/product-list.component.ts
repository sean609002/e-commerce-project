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
  previousCategoryId: number = 1;
  seachMode : boolean = false;

  //pagination properties
  pageNumber : number = 1;
  pageSize : number = 10;
  totalElements : number = 0;

  previousKeyword : string = "";

  //dependency injection
  constructor(private productService : ProductService,
              private route : ActivatedRoute
  ){}

  ngOnInit(): void {
    //whenever the param value changes, listProducts() will be called
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.seachMode = this.route.snapshot.paramMap.has('keyword')!
    if(this.seachMode) {
      this.handleSearchProducts();
    }else {
      this.handleListProducts();
    }
  }
  handleSearchProducts() {
    const keyword = this.route.snapshot.paramMap.get('keyword')!;

    //if we have different keyword, then set pageNumber to 1
    if(this.previousKeyword != keyword) {
      this.pageNumber = 1;
    }

    //keep track of keyword
    this.previousKeyword = keyword;


    this.productService.searchProductListPaginate(this.pageNumber - 1,
                                                  this.pageSize,
                                                  keyword).subscribe(this.processResult());
  }

  handleListProducts() {
    const hasCategoryId = this.route.snapshot.paramMap.has('id')!;
    if(hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }

    //if we have different category id, then we have to set pageNumber to 1
    if(this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }
    
    //keep track of category id
    this.previousCategoryId = this.currentCategoryId;

    //get data using productService API
    //we minus/plus on pageNumber because Spring Data REST is 0-based pagination
    //but ng-bootstrap is 1-based
    this.productService.getProductListPaginate(this.pageNumber - 1, 
                                               this.pageSize, 
                                               this.currentCategoryId).subscribe(this.processResult());                             
  }

  updatePageSize(pageSize : string) {
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  processResult() {
    return (data : any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    }
  }
}
