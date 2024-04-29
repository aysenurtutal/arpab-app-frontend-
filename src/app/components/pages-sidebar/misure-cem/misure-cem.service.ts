import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {BaseResponse} from "../../../core/models/base-response";
import {MisureCemDto} from "./misure-cem-dto";
import {MisureCemComponent} from "./misure-cem.component";

@Injectable({
  providedIn: 'root'
})
export class MisureCemService {
  private _portalApiRoot = `${environment.apiRoot}`;
  constructor(private http: HttpClient) { }

  getMisureCemData(): Observable<MisureCemDto[]> {
    const networkUrl = this._portalApiRoot + `misurecemAll`;
    return this.http
        .get<BaseResponse<MisureCemDto[]>>(networkUrl)
        .pipe(map((m) => m.data));
  }
  postSaveNewMisureCemData(dtoOut: MisureCemDto): Observable<MisureCemDto> {
    const networkUrl = this._portalApiRoot + `misurecem`;
    return this.http.post<MisureCemDto>(networkUrl,{fields:dtoOut});
  }
  putUpdatedOneDataMisureCem(idimiscem: number, dtoOut: MisureCemDto): Observable<MisureCemDto> {
    const networkUrl = `${this._portalApiRoot}misurecem?idimiscem=${idimiscem}`;
    return this.http.put<MisureCemDto>(networkUrl, {fields:dtoOut});
  }
  deleteSelectedDataMisureCem(idimiscem: any): Observable<any> {
    const primaryKey = 'idimiscem';
    const networkUrl = `${this._portalApiRoot}misurecem/single?primaryKey=${primaryKey}&primaryKeyValue=${idimiscem}`;
    return this.http.delete<any>(networkUrl);
  }
  deletemultipleSelectedDatasMisureCem(idimiscems: number[]): Observable<any> {
    const primaryKey = 'idimiscem';
    const networkUrl = `${this._portalApiRoot}misurecem/multiple?primaryKey=${primaryKey}`;
    return this.http.delete<any>(networkUrl, { body: idimiscems });
  }

  attivitàSelectboxValuesMisureCem(): Observable<any>{
    const networkUrl = this._portalApiRoot + `misurecem/attivita`;
    return this.http
        .get<BaseResponse<any[]>>(networkUrl)
        .pipe(map((m) => m.data));
  }
  tipologiaSelectboxValuesMisureCem(): Observable<any>{
    const networkUrl = this._portalApiRoot + `misurecem/tipologia`;
    return this.http
        .get<BaseResponse<any[]>>(networkUrl)
        .pipe(map((m) => m.data));
  }
  comuneSelectboxValuesMisureCem(): Observable<any>{
    const networkUrl = this._portalApiRoot + `misurecem/comune`;
    return this.http
        .get<BaseResponse<any[]>>(networkUrl)
        .pipe(map((m) => m.data));
  }
  provinciaSelectboxValuesMisureCem(): Observable<any>{
    const networkUrl = this._portalApiRoot + `misurecem/provincia`;
    return this.http
        .get<BaseResponse<any[]>>(networkUrl)
        .pipe(map((m) => m.data));
  }
  numcodsitoSelectboxValuesRilevazioniSito(): Observable<any>{
    const networkUrl = this._portalApiRoot + `misurecem/numcodsito`;
    return this.http
        .get<BaseResponse<any[]>>(networkUrl)
        .pipe(map((m) => m.data));
  }
  modellostrumSelectboxValuesRilevazioniSito(): Observable<any>{
    const networkUrl = this._portalApiRoot + `misurecem/modstrum`;
    return this.http
        .get<BaseResponse<any[]>>(networkUrl)
        .pipe(map((m) => m.data));
  }
  sondaCollegataSelectboxValuesRilevazioniSito(): Observable<any>{
    const networkUrl = this._portalApiRoot + `misurecem/sonda`;
    return this.http
        .get<BaseResponse<any[]>>(networkUrl)
        .pipe(map((m) => m.data));
  }
  taraturastrumSelectboxValuesRilevazioniSito(): Observable<any>{
    const networkUrl = this._portalApiRoot + `misurecem/tartstrum`;
    return this.http
        .get<BaseResponse<any[]>>(networkUrl)
        .pipe(map((m) => m.data));
  }

}
