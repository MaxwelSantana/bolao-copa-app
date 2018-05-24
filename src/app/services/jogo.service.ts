import { Injectable } from '@angular/core';
import { JogoEndpointService } from "./jogo-endpoint.service";
import { EventsService } from "angular4-events/esm/src";

@Injectable()
export class JogoService {

  jogos: any[] = [];

  constructor(private jogoEndpointService: JogoEndpointService, private events: EventsService) { }

  loadJogos() {
    this.jogoEndpointService.getJogos().subscribe(jogos => {
      this.jogos = jogos;
      this.events.publish('jogosLoaded');
    });
  }

  getJogosByGrupo(idGrupo) {
    return this.jogos.filter(jogo => jogo.grupo_id == idGrupo);
  }

}
