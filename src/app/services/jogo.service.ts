import { Injectable } from '@angular/core';
import { JogoEndpointService } from "./jogo-endpoint.service";
import { EventsService } from "angular4-events/esm/src";
import { MessageService } from "./message.service";
import { LoaderService } from "./loader.service";

@Injectable()
export class JogoService {

  jogos: any[] = [];
  jogosModificados: any[] = [];

  constructor(private jogoEndpointService: JogoEndpointService, private events: EventsService, private messageService: MessageService, private loaderService: LoaderService) { }

  loadJogos() {
    this.jogoEndpointService.getJogos().subscribe(jogos => {
      this.jogos = jogos;
      this.events.publish('jogosLoaded');
    });
  }

  getJogosByGrupo(idGrupo) {
    return this.jogos.filter(jogo => jogo.grupo_id == idGrupo);
  }

  getJogos() {
    return this.jogos;
  }

  getJogo(idJogo) {
    return this.jogos.find(jogo => jogo.jogo_id == idJogo);
  }

  jogoModificado(jogo) {
    let jogoJaModificado = this.jogosModificados.find(j => j._id == jogo._id);
    jogo.finalizado = true;
    if(jogoJaModificado) {
      Object.assign(jogoJaModificado, jogo);
    } else {
      this.jogosModificados.push(jogo);
    }
  }

  updateJogosModificados() {
    this.loaderService.toggle();
    this.jogoEndpointService.updateJogos(this.jogosModificados).subscribe(() => {
      this.jogosModificados = [];
      this.messageService.success('Jogos Atualizados!');
      this.loaderService.toggle();
      this.events.publish('loadAll');
    });
  }
}
