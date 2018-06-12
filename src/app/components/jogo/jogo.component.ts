import { Component, OnInit,OnChanges,  Input , AfterContentInit, SimpleChanges} from '@angular/core';
import { SedeService } from "../../services/sede.service";
import { PalpiteService } from "../../services/palpite.service";
import { EventsService } from "angular4-events/esm/src";
import { JogoService } from "../../services/jogo.service";
import { EquipeService } from "../../services/equipe.service";

@Component({
  selector: 'app-jogo',
  templateUrl: './jogo.component.html'
})
export class JogoComponent implements AfterContentInit, OnChanges {

  @Input("jogo")
  jogo: any;

  @Input("userId")
  userId = null;
  
  palpite: any = { 
    placar_mandante: 0,
    placar_visitante: 0
  };

  placarOficial = false;

  constructor(private sedeService: SedeService, private equipeService: EquipeService, private palpiteService: PalpiteService, private jogoService: JogoService,
    private events: EventsService, private pubsub: EventsService) { }

  ngAfterContentInit() {
      this.pubsub.subscribe('resetPalpites', () => {
        this.loadPalpite();
      });

      this.loadPalpite();

      this.pubsub.subscribe('placarOficialMode', (placarOficial) => {
        this.placarOficial = placarOficial;
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.loadPalpite();
  }

  loadPalpite() {
    this.palpite = { placar_mandante: 0, placar_visitante: 0 };
    if(this.userId){
      this.palpite = this.palpiteService.getPalpiteByUsuarioAndJogo(this.jogo.jogo_id, this.userId);
    } else {
      this.palpite = this.palpiteService.getPalpiteByUsuarioAndJogo(this.jogo.jogo_id);
    }

    this.palpite.equipe_mandante_id = this.jogo.equipe_mandante_id;
    this.palpite.equipe_visitante_id = this.jogo.equipe_visitante_id;
    this.palpite.grupo_id = this.jogo.grupo_id;
  }

  get hasPenaltis() {
    return this.jogo.fase_id != 5362;
  }
  
  get sede() {
    return this.sedeService.getSedeById(this.jogo.sede_id);
  }

  get jogoEmpatado() {
    if(!this.jogo.placar_oficial_mandante || !this.jogo.placar_oficial_visitante)
      return false;
    return this.jogo.placar_oficial_mandante === this.jogo.placar_oficial_visitante;
  }

  get getPlacarOficialMandante() {
    if(this.hasPenaltis && this.jogoEmpatado){
      return `${this.jogo.placar_oficial_mandante} (${this.jogo.placar_penaltis_mandante})`;
    } else {
      return this.jogo.placar_oficial_mandante;
    }
  }

  get getPlacarOficialVisitante() {
    if(this.hasPenaltis && this.jogoEmpatado){
      return `${this.jogo.placar_oficial_visitante} (${this.jogo.placar_penaltis_visitante})`;
    } else {
      return this.jogo.placar_oficial_visitante;
    }
  }

  get getPalpiteMandante() {
    return this.palpite.placar_mandante != undefined && this.palpite.placar_mandante != null ? this.palpite.placar_mandante : '?'
  }

  get getPalpiteVisitante() {
    return this.palpite.placar_visitante != undefined && this.palpite.placar_visitante != null ? this.palpite.placar_visitante : '?'
  }

  partidaFinalizada() {
    return this.jogo.placar_oficial_mandante != null;
  }

  palpiteAlterado() {
    this.palpite.alterado = true;
    this.events.publish('palpiteAlterado', this.palpite);
  }

  finalizarJogo() {
    this.jogoService.jogoModificado(this.jogo);
  }

  getEquipe(idEquipe) {
    return this.equipeService.getEquipe(idEquipe);
  }

  getEscudo(idEquipe) {
    let equipe = this.getEquipe(idEquipe);
    if(!equipe || !equipe.escudos['30x30'])
      return "http://s.glbimg.com/es/sde/f/organizacoes/escudo_default_30x30.png";
    return equipe.escudos['30x30'];
  }
}
