import { Component, OnInit, Input , AfterContentInit} from '@angular/core';
import { SedeService } from "../../services/sede.service";
import { PalpiteService } from "../../services/palpite.service";
import { EventsService } from "angular4-events/esm/src";
import { JogoService } from "../../services/jogo.service";
import { EquipeService } from "../../services/equipe.service";

@Component({
  selector: 'app-jogo',
  templateUrl: './jogo.component.html'
})
export class JogoComponent implements AfterContentInit {

  @Input("jogo")
  jogo: any;
  
  palpite: any = { 
    placar_mandante: 0,
    placar_visitante: 0
  };

  placarOficial = false;

  constructor(private sedeService: SedeService, private equipeService: EquipeService, private palpiteService: PalpiteService, private jogoService: JogoService,
    private events: EventsService, private pubsub: EventsService) { }

  ngAfterContentInit() {
      this.palpite = this.palpiteService.getPalpiteByUsuarioAndJogo(this.jogo.jogo_id);
      this.palpite.equipe_mandante_id = this.jogo.equipe_mandante_id, 
      this.palpite.equipe_visitante_id = this.jogo.equipe_visitante_id,
      this.palpite.grupo_id = this.jogo.grupo_id

      this.pubsub.subscribe('placarOficialMode', (placarOficial) => {
        this.placarOficial = placarOficial;
      });
  }

  get sede() {
    return this.sedeService.getSedeById(this.jogo.sede_id);
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

  jogoEmpatado(placar_oficial_mandante, placar_oficial_visitante) {
    if(!placar_oficial_mandante || !placar_oficial_visitante)
      return false;
    return placar_oficial_mandante === placar_oficial_visitante;
  }
}
