import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class EquipeEndpointService {

  constructor(private http: HttpClient) { }

  equipeUrl = "http://192.168.0.105:3000/equipes";

  getEquipes(): Observable<any> {
    return this.http.get(this.equipeUrl);
  }
}
