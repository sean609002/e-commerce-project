import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = environment.baseUrl + '/products';
  private categoryUrl = environment.baseUrl + '/product-category';
  constructor(private httpClient : HttpClient) { }

  getProductList(categoryId : number) : Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByProductCategoryId?id=${categoryId}`;
    return this.getProducts(searchUrl);
  }

  getProductCategoryList() : Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(keyword: string) : Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;
    return this.getProducts(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductListPaginate(page : number, size : number, categoryId : number) : Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}/search/findByProductCategoryId?id=${categoryId}`
                    + `&page=${page}&size=${size}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  searchProductListPaginate(page : number, size : number, keyword : string) : Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`
                    + `&page=${page}&size=${size}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProduct(productId: number) : Observable<Product> {
    const productUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(productUrl);
  }

}

interface GetResponseProducts {
  _embedded : {
    products : Product[]
  }
  page : {
    size : number,
    totalElements : number,
    totalPages : number,
    number : number
  }
}

interface GetResponseProductCategory {
  _embedded : {
    productCategory : ProductCategory[]
  }
}
