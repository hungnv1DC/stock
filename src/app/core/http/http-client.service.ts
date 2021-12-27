/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpUrlEncodingCodec } from '@angular/common/http';
// import { OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
export default class CustomEncoder extends HttpUrlEncodingCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }
}
export interface IRequestOptions {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  body?: any;
}

@Injectable()
export class CustomHttpClient implements OnDestroy {
  public refreshTokenSubject: Subject<string>;
  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private http: HttpClient,
    private _router: Router,
    private _toastrService: ToastrService,
    // private oAuthStorage: OAuthStorage
  ) { }
  public Get<T>(domainType?: string, endPoint?: string, options?: IRequestOptions): Observable<T> {
    if (options && options.params) {
      options.params = new HttpParams({ encoder: new CustomEncoder(), fromObject: { ...options.params } });
    }
    return this.intercept<T>(this.http.get<T>(domainType + endPoint, options));
  }

  public Post<T>(domainType: string, endPoint: string, params: Object, options?: IRequestOptions): Observable<T> {
    return this.intercept<T>(this.http.post<T>(domainType + endPoint, params, options));
  }

  public Put<T>(domainType: string, endPoint: string, params: Object, options?: IRequestOptions): Observable<T> {
    return this.intercept<T>(this.http.put<T>(domainType + endPoint, params, options));
  }

  public Delete<T>(domainType: string, endPoint: string, options?: IRequestOptions): Observable<T> {
    return this.intercept<T>(this.http.delete<T>(domainType + endPoint, options));
  }

  public Patch<T>(domainType: string, endPoint: string, params: Object): Observable<T> {
    return this.intercept<T>(this.http.patch<T>(domainType + endPoint, params));
  }

  public Request<T>(method: string, domainType: string, endPoint: string, body?: any): Observable<T> {
    return this.intercept<T>(this.http.request<T>(method, domainType + endPoint, {body}));
  }

  public intercept<T>(observable: Observable<T>): Observable<T> {
    return new Observable<T>((subscriber) => {
      observable.subscribe(
        (data) => {
          subscriber.next(data);
        },
        (error) => {
          this.handleError(error);
          subscriber.error(error);
        },
        () => {
          subscriber.complete();
        }
      );
    });
  }
  handleError(error) {
    // if (error.status === 401) {
    //   this._util.showErrorVinID(error);
    //   localStorage.clear();
    //   this._router.navigate(['/sign-in']);
    // }

    if (error.status === 403) {
      this._router.navigate(['/error-pages/403']);
    }
    if (error.status === 503) {
      // this._toastrService.error(AppConstant.commonType.ERROR_HTTP_503);
      return;
    }

    if (error.status === 504) {
      // this._toastrService.error(AppConstant.commonType.REQUEST_TIMEOUT);
      return;
    }
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


}
