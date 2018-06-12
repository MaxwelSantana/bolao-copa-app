import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { API } from "../app.api";

@Injectable()
export class UserEndpointService {

  constructor(private http: HttpClient) { }

  userURL = `${API}/users`;

  getUsers(): Observable<any> {
    return this.http.get(this.userURL);
  }
}