import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

@Injectable()
export class FaseEndpointService {

  constructor(private http: HttpClient) { }

  faseURL = "http://192.168.0.105:3000/fases";

  getFases(): Observable<any> {
    return this.http.get(this.faseURL);
  }
}