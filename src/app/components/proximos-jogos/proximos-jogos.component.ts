import { Component, OnInit } from '@angular/core';
import { JogoService } from "../../services/jogo.service";
import { EventsService } from "angular4-events";
import * as moment from 'moment';
import { EquipeService } from "../../services/equipe.service";

@Component({
  selector: 'app-proximos-jogos',
  templateUrl: './proximos-jogos.component.html'
})
export class ProximosJogosComponent implements OnInit {

  proximosJogos: any[] = [];
  equipes: any[] = [];

  constructor(private jogoService: JogoService,private equipeService: EquipeService, private pubsub: EventsService) { }

  ngOnInit() {
    this.equipeService.loadEquipes();
    this.jogoService.loadJogos();

    this.pubsub.subscribe('jogosLoaded').subscribe(() => {
      this.setProximosJogos(this.jogoService.getJogos());
    });
  }

  setProximosJogos(jogos) {
    this.proximosJogos = this.sortJogosByDate(jogos).slice(0,10);
    
  }

  sortJogosByDate(jogos): any[] {
    return jogos.sort((jogo1, jogo2) => {
      let diff = moment(`${jogo1.data_realizacao} ${ jogo1.hora_realizacao ? jogo1.hora_realizacao : ""}`)
        .diff(moment(`${jogo2.data_realizacao} ${ jogo2.hora_realizacao ? jogo2.hora_realizacao : "" }`));
      return diff;
    });
  }

}
