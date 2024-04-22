import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {BaseResponse} from "../../../core/models/base-response";
import {CodiceSitoGestoriDto} from "./codice-sito-gestori-dto";

@Injectable({
  providedIn: 'root'
})
export class CodiceSitoGestoriService {
  private _portalApiRoot = `${environment.apiRoot}`;
  constructor(private http: HttpClient) { }

  getCodiceSitoGestoriData(): Observable<CodiceSitoGestoriDto[]> {
    const networkUrl = this._portalApiRoot + `codicesitogestoriAll`;
    return this.http
        .get<BaseResponse<CodiceSitoGestoriDto[]>>(networkUrl)
        .pipe(map((m) => m.data));
  }
  postSaveNewCodiceSitoGestoriData(dtoOut: CodiceSitoGestoriDto): Observable<CodiceSitoGestoriDto> {
    const networkUrl = this._portalApiRoot + `codicesitogestoriAll`;
    return this.http.post<CodiceSitoGestoriDto>(networkUrl, dtoOut);
  }
  putUpdatedOneDataCodiceSitoGestori(idprot: number, dtoOut: CodiceSitoGestoriDto): Observable<CodiceSitoGestoriDto> {
    const networkUrl = `${this._portalApiRoot}codicesitogestori?idprot=${idprot}`;
    return this.http.put<CodiceSitoGestoriDto>(networkUrl, dtoOut);
  }
  deleteSelectedDataCodiceSitoGestori(idprot: any): Observable<any> {
    const networkUrl = `${this._portalApiRoot}codicesitogestori/single?idprot=${idprot}`;
    return this.http.delete<any>(networkUrl, {});
  }
  deletemultipleSelectedDatasCodiceSitoGestori(idprots: number[]): Observable<any> {
    const networkUrl = `${this._portalApiRoot}codicesitogestori/multiple`;
    return this.http.delete<any>(networkUrl, { body: idprots });
  }
  gestoreSelectboxValuesCodiceSitoGestori(): Observable<any>{
    const networkUrl = this._portalApiRoot + `codicesitogestori/gestore`;
    return this.http
        .get<BaseResponse<any[]>>(networkUrl)
        .pipe(map((m) => m.data));
  }
  regioneSelectboxValuesCodiceSitoGestori(): Observable<any>{
    const networkUrl = this._portalApiRoot + `codicesitogestori/regione`;
    return this.http
        .get<BaseResponse<any[]>>(networkUrl)
        .pipe(map((m) => m.data));
  }
  provinciaSelectboxValuesCodiceSitoGestori(): Observable<any>{
    const networkUrl = this._portalApiRoot + `codicesitogestori/provincia`;
    return this.http
        .get<BaseResponse<any[]>>(networkUrl)
        .pipe(map((m) => m.data));
  }
  comuneSelectboxValuesCodiceSitoGestori(): Observable<any>{
    const networkUrl = this._portalApiRoot + `codicesitogestori/comune`;
    return this.http
        .get<BaseResponse<any[]>>(networkUrl)
        .pipe(map((m) => m.data));
  }
  protcollSelectboxValuesCodiceSitoGestori(): Observable<any>{
    const networkUrl = this._portalApiRoot + `codicesitogestori/protcoll`;
    return this.http
        .get<BaseResponse<any[]>>(networkUrl)
        .pipe(map((m) => m.data));
  }
}
