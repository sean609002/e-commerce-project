import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailsService {
  private baseUrl = `${environment.baseUrl}/user`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  //dynamically add withCredentials property to httpOptions
  private getHttpOptions(isLoginOrLogout: boolean = false): any {
    return isLoginOrLogout
      ? { ...this.httpOptions, withCredentials: true }
      : this.httpOptions;
  }
  constructor(private httpClient: HttpClient) { }

  getOrderItemsPaginate(page: number, size: number, id: number): Observable<any> {
    const orderItemPaginateUrl = `${this.baseUrl}/order/orderItem?id=${id}`
                                +  `&page=${page}&size=${size}`;
    return this.httpClient.get(orderItemPaginateUrl, this.getHttpOptions(true));
  }
}
