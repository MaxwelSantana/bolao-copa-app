import { Component, OnInit, Input , AfterContentInit} from '@angular/core';
import { SedeService } from "../../services/sede.service";
import { PalpiteService } from "../../services/palpite.service";
import { EventsService } from "angular4-events/esm/src";

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

  constructor(private sedeService: SedeService, private palpiteService: PalpiteService, private events: EventsService) { }

  ngAfterContentInit() {
    /*
    Object.assign(this.palpite, 
      this.palpiteService.getPalpiteByUsuarioAndJogo(this.jogo.jogo_id),
      {
        equipe_mandante_id: this.jogo.equipe_mandante_id, 
        equipe_visitante_id: this.jogo.equipe_visitante_id,
        grupo_id: this.jogo.grupo_id
      }); */
      this.palpite = this.palpiteService.getPalpiteByUsuarioAndJogo(this.jogo.jogo_id);
      this.palpite.equipe_mandante_id = this.jogo.equipe_mandante_id, 
      this.palpite.equipe_visitante_id = this.jogo.equipe_visitante_id,
      this.palpite.grupo_id = this.jogo.grupo_id
  }

  get sede() {
    return this.sedeService.getSedeById(this.jogo.sede_id);
  }

  teste() {
    console.log(this.jogo.jogo_id, this.palpite, this.palpiteService.getPalpitesByUsuario());
  }

  partidaFinalizada() {
    return this.jogo.placar_oficial_mandante != null;
  }

  palpiteAlterado() {
    this.palpite.alterado = true;
    this.events.publish('palpiteAlterado', this.palpite);
  }
}
