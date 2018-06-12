import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { API } from "../app.api";

@Injectable()
export class SedeEndpointService {

  constructor(private http: HttpClient) { }

  sedeUrl = `${API}/sedes`;

  getSedes(): Observable<any> {
    return this.http.get(this.sedeUrl);
  }

}
