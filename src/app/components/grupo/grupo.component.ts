import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { EquipeService } from "../../services/equipe.service";
import { EventsService } from "angular4-events/esm/src";
import { JogoService } from "../../services/jogo.service";
import * as moment from 'moment';
import { PalpiteService } from "../../services/palpite.service";

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

  pontuacaoVazia = {
        "jogos" : 0, 
        "vitorias" : 0, 
        "empates" : 0, 
        "derrotas" : 0, 
        "gols_pro" : 0, 
        "gols_contra" : 0
    }

  constructor(private equipeService: EquipeService, private jogoService: JogoService, 
    private palpiteService: PalpiteService, private pubsub: EventsService) { }

  ngOnInit(): void {
      this.pubsub.subscribe('jogosLoaded').subscribe(() => {
        this.setJogosByGrupo();
      });
      this.pubsub.subscribe('equipesLoaded').subscribe(() => {
        this.setEquipesByGrupo();
      });
      this.pubsub.subscribe('palpiteAlterado').subscribe((palpite) => {
        this.palpiteAlterado(palpite);
      });
  }

  palpiteAlterado(palpite) {
    console.log(palpite);
    if(this.grupo.grupo_id == palpite.grupo_id) {
      this.updateClassificacao();
    }
  }

  updateClassificacao() {
    let palpites = this.palpiteService.getPalpitesByUsuarioAndGrupo(this.grupo.grupo_id);
    
    if(!palpites.length)
      return;
    
    this.equipes.forEach(equipe => {
      if(!equipe.pontuacao) {
        equipe.pontuacao = Object.assign({}, this.pontuacaoVazia);
      } else {
        Object.assign(equipe.pontuacao, this.pontuacaoVazia);
      }
    });

    palpites.forEach(p => {
      let equipe_mandante = this.equipes.find(e => e.equipe_id == p.equipe_mandante_id);
      let equipe_visitante = this.equipes.find(e => e.equipe_id == p.equipe_visitante_id);

      this.updatePontuacao(equipe_mandante, p.placar_mandante, p.placar_visitante);
      this.updatePontuacao(equipe_visitante, p.placar_visitante, p.placar_mandante);

    });

    this.sortEquipes();
  }

  updatePontuacao(equipe, placar, placar_adversario) {
    let { jogos, vitorias, derrotas, empates, gols_pro, gols_contra } = equipe.pontuacao;

    let result = placar - placar_adversario;

    Object.assign(equipe.pontuacao, {
      jogos: jogos + 1, 
      gols_pro: gols_pro + placar, 
      gols_contra: gols_contra + placar_adversario 
    });

    if(result > 0) {
      Object.assign(equipe.pontuacao, {vitorias: vitorias + 1});
    } else if (result < 0) {
      Object.assign(equipe.pontuacao, {derrotas: derrotas + 1});
    } else if (result == 0) {
      Object.assign(equipe.pontuacao, {empates: empates + 1});
    }

  }

  sortEquipes() {
    this.equipes.sort((equipe1, equipe2) => {
      let result = this.getPontos(equipe2) - this.getPontos(equipe1);
      
      if(result == 0) {
        if(this.getSaldoGols(equipe1) < this.getSaldoGols(equipe2) ) return 1
        if(this.getSaldoGols(equipe1) > this.getSaldoGols(equipe2) ) return -1
        else {
          if(equipe1.pontuacao && equipe2.pontuacao && equipe1.pontuacao.gols_pro < equipe2.pontuacao.gols_pro) return 1
          if(equipe1.pontuacao && equipe2.pontuacao && equipe1.pontuacao.gols_pro > equipe2.pontuacao.gols_pro) return -1
          else {
            if(equipe1.nome_popular < equipe2.nome_popular) return -1;
            if(equipe1.nome_popular > equipe2.nome_popular) return 1;
            return 0;
          }
        }
      }
      
      return result;
    });
  }

  getPontos(equipe) {
    if(equipe.pontuacao)
      return ( equipe.pontuacao.vitorias * 3 ) + equipe.pontuacao.empates;
    return 0;
  }

  getSaldoGols(equipe) {
    if(equipe.pontuacao)
      return equipe.pontuacao.gols_pro - equipe.pontuacao.gols_contra;
    return 0;
  }

  setEquipesByGrupo() {
    this.equipes = this.equipeService.getEquipesByIds(this.grupo.equipes);
    this.updateClassificacao();
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
