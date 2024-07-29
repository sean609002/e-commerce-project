import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { OrderHistory } from '../../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  private baseUrl = 'http://localhost:8080/api/user';

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
  
  getOrderHistory(email: string): Observable<any> {
    const orderHistoryUrl = `${this.baseUrl}/orders?email=${email}`;
    return this.httpClient.get<any>(orderHistoryUrl, this.getHttpOptions(true));
  }
}
