/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomHttpClient } from '@app/core/http/http-client.service';
import { environment } from '@env';
import { Observable } from 'rxjs';

import { Project } from '../schema/project';
import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private jsonApiService: JsonApiService,
    private _http: CustomHttpClient,
    private http: HttpClient) {}


  getAll(): Observable<Array<Project>> {
    return this.jsonApiService.get('https://api.vietstock.vn/finance/sectorInfo_v2?sectorID=0&catID=0&capitalID=0&languageID=1');
  }

  public getSymbols(): Observable<any> {
    const headers = new HttpHeaders({ Authorization: environment.fireantToken });

   return this._http.Get<any>('https://api.fireant.vn/symbols/search?keywords&limit=5000&type=stock', '', {headers});
  }

  public getHistorical(symbol?: string): Observable<any> {
    // eslint-disable-next-line max-len
    const headers = new HttpHeaders({ Authorization: environment.fireantToken});
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 1);

    endDate.setUTCHours(8);
    endDate.setUTCMinutes(0);
    endDate.setUTCSeconds(0);
    endDate.setUTCMilliseconds(0);
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 22);
    startDate.setUTCHours(2);
    startDate.setUTCMinutes(0);
    startDate.setUTCSeconds(0);
    startDate.setUTCMilliseconds(0);

    // eslint-disable-next-line max-len
    return this._http.Get<any>(`https://api.fireant.vn/symbols/${symbol}/historical-quotes?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`, '', {headers});
    // return this._http.Get<any>('http://6fa2-183-91-5-102.ngrok.io/test', '');
  }

  getSingle(id: number): Observable<Project> {
    return this.jsonApiService.get(`/projects/${id}`);
  }
}
