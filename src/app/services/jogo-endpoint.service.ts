import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { API } from "../app.api";

@Injectable()
export class JogoEndpointService {

  constructor(private http: HttpClient) { }

  jogoUrl = `${API}/jogos`;

  getJogos(): Observable<any> {
    return this.http.get(this.jogoUrl);
  }

  updateJogos(jogos: any[]): Observable<any> {
    return this.http.put(this.jogoUrl, jogos);
  }
    
}
