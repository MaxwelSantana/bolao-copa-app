import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { EquipeService } from "../../services/equipe.service";
import { EventsService } from "angular4-events/esm/src";
import { JogoService } from "../../services/jogo.service";
import * as moment from 'moment';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html'
})
export class GrupoComponent implements OnInit {
  
  @Input("grupo")
  grupo: any;

  equipes: any[] = [];
  jogos: any[] = [];

  rodada = 1;
  minRodadas = 1;
  maxRodadas = 3;
  indiceInicial = 0;
  indiceFinal = 2;

  constructor(private equipeService: EquipeService, private jogoService: JogoService, private pubsub: EventsService) { }

  ngOnInit(): void {
      this.pubsub.subscribe('jogosLoaded').subscribe(() => {
        this.setJogosByGrupo();
      });
      this.pubsub.subscribe('equipesLoaded').subscribe(() => {
        this.setEquipesByGrupo();
      });
  }

  setEquipesByGrupo() {
    this.equipes = this.equipeService.getEquipesByIds(this.grupo.equipes);
  }

  setJogosByGrupo() {
    this.jogos = this.jogoService.getJogosByGrupo(this.grupo.grupo_id);
    this.jogos.forEach(jogo => {
      Object.assign(jogo, {
        equipe_mandante: this.findEquipe(jogo.equipe_mandante_id),
        equipe_visitante: this.findEquipe(jogo.equipe_visitante_id)
      });
    });
    this.sortJogosByDate();
  }

  sortJogosByDate() {
    this.jogos.sort((jogo1, jogo2) => {
      return moment(jogo1.data_realizacao).diff(moment(jogo2.data_realizacao));
    });
  }

  findEquipe(id) {
    return this.equipes.find(equipe => equipe.equipe_id == id);
  }

  nextRodada() {
    if(this.rodada < this.maxRodadas) {
      this.indiceInicial += 2;
      this.indiceFinal += 2;
      this.rodada++;
    }
  }

  previousRodada() {
    if(this.rodada > this.minRodadas) {
      this.indiceInicial -= 2;
      this.indiceFinal -= 2;
      this.rodada--;
    }
  }

  get jogosByRodada() {
    return this.jogos.slice(this.indiceInicial, this.indiceFinal);
  }
}
