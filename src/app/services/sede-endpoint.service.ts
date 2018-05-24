import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class SedeEndpointService {

  constructor(private http: HttpClient) { }

  sedeUrl = "http://192.168.0.105:3000/sedes";

  getSedes(): Observable<any> {
    return this.http.get(this.sedeUrl);
  }

}
