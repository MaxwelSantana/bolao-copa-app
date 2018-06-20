import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { JogoService } from "../../services/jogo.service";
import { EventsService } from "angular4-events";
import * as moment from 'moment';
import { EquipeService } from "../../services/equipe.service";
import { PalpiteService } from "../../services/palpite.service";
import { FaseService } from "../../services/fase.service";
import { LoaderService } from "../../services/loader.service";

@Component({
  selector: 'app-proximos-jogos',
  templateUrl: './proximos-jogos.component.html'
})
export class ProximosJogosComponent implements OnInit, OnChanges {

  filteredJogos: any[] = [];
  jogos: any[] = [];
  equipes: any[] = [];

  filtros = [
    { faseId: 5362, label: 'Fase de grupos: Rodada 1', data: '14/06 - 19/06', dataInicial:'2018-06-14', dataFinal: '2018-06-19', filterBy: 'rodada', value: 1 },
    { faseId: 5362, label: 'Fase de grupos: Rodada 2', data: '19/06 - 24/06', dataInicial:'2018-06-19', dataFinal: '2018-06-24', filterBy: 'rodada', value: 2 },
    { faseId: 5362, label: 'Fase de grupos: Rodada 3', data: '25/06 - 28/06', dataInicial:'2018-06-25', dataFinal: '2018-06-28', filterBy: 'rodada', value: 3 },
    { faseId: 5363, label: 'Oitavas de final', data: '30/06 - 03/07', dataInicial:'2018-06-30', dataFinal: '2018-07-03', filterBy: 'fase_id', value: 5363 },
    { faseId: 5364, label: 'Quartas de final', data: '06/07 - 07/07', dataInicial:'2018-07-06', dataFinal: '2018-07-07', filterBy: 'fase_id', value: 5364 },
    { faseId: 5365, label: 'Semifinais', data: '10/07 - 11/07', dataInicial:'2018-07-10', dataFinal: '2018-07-11', filterBy: 'fase_id', value: 5365 },
    { faseId: 5473, label: 'Terceiro Lugar', data: '14/07', dataInicial:'2018-07-14', dataFinal: '2018-07-14', filterBy: 'fase_id', value: 5473 },
    { faseId: 5366, label: 'Final', data: '15/07', dataInicial:'2018-07-15', dataFinal: '2018-07-15', filterBy: 'fase_id', value: 5366 }
  ];

  filtroSelecionado = {};

  jogosSubscriber: any;
  fasesSubscriber: any;

  @Input("userId")
  userId = null;

  constructor(private faseService: FaseService, private jogoService: JogoService,private equipeService: EquipeService, 
    private pubsub: EventsService, private palpiteService: PalpiteService, private loaderService: LoaderService) { }

  ngOnInit() {
    //this.setFiltroByDataAtual();
    this.loaderService.toggle();
    this.equipeService.loadEquipes();
    this.jogoService.loadJogos();
    this.faseService.loadFases();

    this.jogosSubscriber = this.pubsub.subscribe('jogosLoaded').subscribe(() => {
      this.setProximosJogos(this.jogoService.getJogos());
    });

    this.fasesSubscriber = this.pubsub.subscribe('fasesLoaded').subscribe(() => {
      this.filterComboByFase();
      this.loaderService.toggle();
    });
  }

  ngOnDestroy() {
    this.jogosSubscriber.unsubscribe();
    this.fasesSubscriber.unsubscribe();
  }

  filterComboByFase() {
    this.filtros = this.filtros.filter(filtro => {
      let fase = this.faseService.getFase(filtro.faseId);
      return fase && (fase.finalizado || fase.atual);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setFiltroByDataAtual();
  }

  setFiltroByDataAtual() {
    let today = moment();

    if(today.isBefore(this.filtros[0].dataInicial)) {
      this.filtroSelecionado = this.filtros[0];
      this.filterJogos(this.filtroSelecionado);
      return;
    }

    if(today.isAfter(this.filtros[this.filtros.length-1].dataFinal)) {
      this.filtroSelecionado = this.filtros[this.filtros.length-1];
      this.filterJogos(this.filtroSelecionado);
      return;
    }

    this.filtroSelecionado = this.filtros.find(filtro => today.isBetween(filtro.dataInicial, filtro.dataFinal));
    this.filterJogos(this.filtroSelecionado);
  }

  setProximosJogos(jogos) {
    this.jogos = jogos;
    this.setFiltroByDataAtual();
  }

  sortJogosByDate(jogos): any[] {
    return jogos.sort((jogo1, jogo2) => {
      let diff = moment(`${jogo1.data_realizacao} ${ jogo1.hora_realizacao ? jogo1.hora_realizacao : ""}`)
        .diff(moment(`${jogo2.data_realizacao} ${ jogo2.hora_realizacao ? jogo2.hora_realizacao : "" }`));
      return diff;
    });
  }

  filterJogos(filtro) {
    this.filtroSelecionado = filtro;
    this.filteredJogos = this.jogos.filter(jogo => {
      return jogo[filtro.filterBy] == filtro.value;
    });
  }

  get hasModification() {
    return this.palpiteService.getPalpitesAlterados().length > 0; 
  }

  savePalpites() {
    this.palpiteService.savePalpites();
  }

  resetPalpites() {
    this.palpiteService.resetPalpitesByUsuario();
  }
}
