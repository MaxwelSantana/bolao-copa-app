import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { API } from "../app.api";

@Injectable()
export class FaseEndpointService {

  constructor(private http: HttpClient) { }

  faseURL = `${API}/fases`;

  getFases(): Observable<any> {
    return this.http.get(this.faseURL);
  }
}