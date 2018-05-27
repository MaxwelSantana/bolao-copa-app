import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class PalpiteEndpointService {

  constructor(private http: HttpClient) { }

  palpiteUrl = "http://192.168.0.105:3000/palpites";

  getPalpites(): Observable<any> {
    return this.http.get(this.palpiteUrl);
  }

  saveMany(palpites: any[]) :Observable<any> {
    return this.http.put(this.palpiteUrl, palpites);
  }
}
