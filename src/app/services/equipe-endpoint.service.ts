import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { API } from "../app.api";

@Injectable()
export class EquipeEndpointService {

  constructor(private http: HttpClient) { }

  equipeUrl = `${API}/equipes`;

  getEquipes(): Observable<any> {
    return this.http.get(this.equipeUrl);
  }
}
