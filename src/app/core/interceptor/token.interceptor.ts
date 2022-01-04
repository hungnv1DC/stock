/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomHttpClient } from '../http/http-client.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, takeUntil } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  public _unsubscribeAll: Subject<any> = new Subject();
  private totalRequest = 0;
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(
    private spinnerService: NgxSpinnerService,
    // private _oAuthService: OAuthService,
    // private _oAuthStorage: OAuthStorage,
    private _http: CustomHttpClient,
    private _router: Router,
    private _toastrService: ToastrService,

  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.totalRequest++;
    this.spinnerService.show();
    // if (localStorage.getItem('id_token') && localStorage.getItem('access_token'))
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.stsTokenManager?.accessToken) {
      this.totalRequest++;
      this.spinnerService.show();
      const httpRequest = request.clone({
        setHeaders: {
          // Authorization: `Bearer ${user?.stsTokenManager?.accessToken}`,

          // eslint-disable-next-line max-len
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxODg5NjIyNTMwLCJuYmYiOjE1ODk2MjI1MzAsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsiYWNhZGVteS1yZWFkIiwiYWNhZGVteS13cml0ZSIsImFjY291bnRzLXJlYWQiLCJhY2NvdW50cy13cml0ZSIsImJsb2ctcmVhZCIsImNvbXBhbmllcy1yZWFkIiwiZmluYW5jZS1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImludmVzdG9wZWRpYS1yZWFkIiwib3JkZXJzLXJlYWQiLCJvcmRlcnMtd3JpdGUiLCJwb3N0cy1yZWFkIiwicG9zdHMtd3JpdGUiLCJzZWFyY2giLCJzeW1ib2xzLXJlYWQiLCJ1c2VyLWRhdGEtcmVhZCIsInVzZXItZGF0YS13cml0ZSIsInVzZXJzLXJlYWQiXSwianRpIjoiMjYxYTZhYWQ2MTQ5Njk1ZmJiYzcwODM5MjM0Njc1NWQifQ.dA5-HVzWv-BRfEiAd24uNBiBxASO-PAyWeWESovZm_hj4aXMAZA1-bWNZeXt88dqogo18AwpDQ-h6gefLPdZSFrG5umC1dVWaeYvUnGm62g4XS29fj6p01dhKNNqrsu5KrhnhdnKYVv9VdmbmqDfWR8wDgglk5cJFqalzq6dJWJInFQEPmUs9BW_Zs8tQDn-i5r4tYq2U8vCdqptXoM7YgPllXaPVDeccC9QNu2Xlp9WUvoROzoQXg25lFub1IYkTrM66gJ6t9fJRZToewCt495WNEOQFa_rwLCZ1QwzvL0iYkONHS_jZ0BOhBCdW9dWSawD6iF1SIQaFROvMDH1rg`,
          // TimezoneOffset: `${new Date().getTimezoneOffset() / 60}`,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
        },
      });
      return next.handle(httpRequest).pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return this.handleAuthError(error);
          } else {
            return throwError(error);
          }
        }),
        takeUntil(this._unsubscribeAll),
        finalize(() => {
          this.totalRequest--;
          this.spinnerService.hide();
          if (!this.totalRequest) {
          }
        })
      );
    }
    return next.handle(request).pipe(
      takeUntil(this._unsubscribeAll),
      finalize(() => {
        this.totalRequest--;
        this.spinnerService.hide();
        if (!this.totalRequest) {
        }
      })
    );
  }
  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    //handle your auth error or rethrow
    if (err.status === 401 || err.status === 403) {
        this._toastrService.error(err.message);

        return of(err.message); // or EMPTY may be appropriate here
    }
    return throwError(err);
}
}


