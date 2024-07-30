import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/data-send-to-backend/purchase';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private purchaseUrl = environment.baseUrl + '/checkout/purchase';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  //dynamically add withCredentials property to httpOptions
  private getHttpOptions(isLoginOrLogout: boolean = false): any {
    return isLoginOrLogout
      ? { ...this.httpOptions, withCredentials: true }
      : this.httpOptions;
  }

  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase, this.getHttpOptions(true));
  }
}
