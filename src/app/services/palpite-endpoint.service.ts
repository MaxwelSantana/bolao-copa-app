import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { API } from "../app.api";

@Injectable()
export class PalpiteEndpointService {

  constructor(private http: HttpClient) { }

  palpiteUrl = `${API}/palpites`;

  getPalpites(): Observable<any> {
    return this.http.get(this.palpiteUrl);
  }

  saveMany(palpites: any[]) :Observable<any> {
    return this.http.put(this.palpiteUrl, palpites);
  }
}
