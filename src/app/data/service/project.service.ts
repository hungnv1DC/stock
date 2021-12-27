import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomHttpClient } from '@app/core/http/http-client.service';
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

  public getList(): Observable<any> {
    return this._http.Get<any>('https://api.vietstock.vn/finance/sectorInfo_v2?sectorID=0&catID=0&capitalID=0&languageID=1');
  }

  getSingle(id: number): Observable<Project> {
    return this.jsonApiService.get(`/projects/${id}`);
  }
}
