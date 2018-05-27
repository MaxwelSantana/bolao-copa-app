import { Injectable } from '@angular/core';
import { EventsService } from "angular4-events/esm/src";
import { PalpiteEndpointService } from "./palpite-endpoint.service";

@Injectable()
export class PalpiteService {

  palpites: any[] = [];
  palpitesByUsuario: any[] = [];

  usuarioId = 1;

  constructor(private palpiteEndpointService: PalpiteEndpointService, private events: EventsService) { }

  loadPalpites() {
    this.palpiteEndpointService.getPalpites().subscribe(palpites => {
      this.palpites = palpites;
      this.palpitesByUsuario = palpites.filter(palpite => palpite.usuario_id === this.usuarioId);
      this.events.publish('palpitesLoaded');
    });
  }

  getPalpiteByUsuarioAndJogo(jogoId) {
    let jogo = this.palpitesByUsuario.find(palpite => palpite.jogo_id == jogoId);

    if(jogo) {
      return jogo;
    } else {
      this.palpitesByUsuario.push({ usuario_id: this.usuarioId, jogo_id : jogoId, placar_mandante: 0, placar_visitante: 0});
      return this.palpitesByUsuario.find(palpite => palpite.jogo_id == jogoId);
    }
      
  }

  getPalpitesByUsuarioAndGrupo(grupoId) {
    return this.palpitesByUsuario.filter(palpite => palpite.grupo_id == grupoId && palpite.alterado);
  }

  getPalpitesByUsuario() {
    return this.palpitesByUsuario;
  }

  savePalpites() {
    this.palpiteEndpointService.saveMany(this.palpitesByUsuario)
      .subscribe((palpites) => {
        this.loadPalpites();
      });
  }

}