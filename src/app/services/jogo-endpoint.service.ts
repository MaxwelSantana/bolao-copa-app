import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class JogoEndpointService {

  constructor(private http: HttpClient) { }

  jogoUrl = "http://192.168.0.105:3000/jogos";

  getJogos(): Observable<any> {
    return this.http.get(this.jogoUrl);
  }
    
}
