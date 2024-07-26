import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, Subscription, switchMap, throwError } from 'rxjs';
import { StorageService } from '../services/member-services/storage.service';
import { AuthService } from '../services/member-services/auth.service';
import { EventData } from '../common/event-data';
import { RefreshTokenService } from '../services/member-services/refresh-token.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor{
  private isRefreshing = false;
  private isLoggedIn!: boolean;
  private logInSubscription!: Subscription;

  constructor(private storageService: StorageService, private authService: AuthService, 
              private refreshTokenService: RefreshTokenService) {
    this.logInSubscription = this.storageService.loggedInStatus.subscribe(
      status => {
        this.isLoggedIn = status;
      }
    );
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        //當accesstoken過期，後端會發出401 response(在authentication的過程中)
        //但是要排除signin(內部也會authenticate，有機會401 response)
        if (error instanceof HttpErrorResponse && !req.url.includes('auth/signin') && error.status === 401) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      if (this.isLoggedIn) {
        return this.authService.refreshToken().pipe(
          switchMap(() => {
            console.log('successfully refresh access token');
            this.isRefreshing = false;
            //繼續發出原本的請求
            return next.handle(request);
          }),
          catchError((error) => {
            console.log('fail to refresh access token');
            this.isRefreshing = false;
            //refresh token過期，就會有403
            if (error.status == '403') {
              console.log('refresh token expired');
              this.refreshTokenService.emit(new EventData('logout', null));
            }

            return throwError(() => error);
          })
        );
      }
    }

    return next.handle(request);
  }

}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];