import { Injectable } from '@angular/core';
import { EventsService } from "angular4-events/esm/src";
import { PalpiteEndpointService } from "./palpite-endpoint.service";
import { AuthenticationService } from "./authentication.service";
import { MessageService } from "./message.service";
import { LoaderService } from "./loader.service";

@Injectable()
export class PalpiteService {

  palpites: any[] = [];
  palpitesCached: any[] = [];

  //usuarioId = 1;

  constructor(private palpiteEndpointService: PalpiteEndpointService, private events: EventsService, 
    private auth: AuthenticationService, private messageService: MessageService, private loaderService: LoaderService) { }

  get usuarioId() {
    return this.auth.getUserDetails()._id;
  }

  loadPalpites() {
    this.palpiteEndpointService.getPalpites().subscribe(palpites => {
      this.palpites = palpites;
      this.resetPalpitesByUsuario();
      this.palpitesCached = [].concat(this.palpites);
      this.events.publish('palpitesLoaded');
    });
  }

  resetPalpitesByUsuario() {
    this.events.publish('resetPalpites');
    this.events.publish('updateClassificacaoGrupos');
  }

  getPalpiteByUsuarioAndJogo(jogoId, userId?) {
    let jogo = this.getPalpitesByUsuario(userId).find(palpite => palpite.jogo_id == jogoId);
    
    if(jogo) {
      return jogo;
    } else {
      if(userId) {
        this.palpites.push({ usuario_id: userId, jogo_id : jogoId, placar_mandante: "-", placar_visitante: "-"});
        return this.getPalpitesByUsuario(userId).find(palpite => palpite.jogo_id == jogoId);
      } else {
        this.palpites.push({ usuario_id: this.usuarioId, jogo_id : jogoId, placar_mandante: "-", placar_visitante: "-"});
        return this.getPalpitesByUsuario().find(palpite => palpite.jogo_id == jogoId);
      }
    }
      
  }

  getPalpitesByUsuarioAndGrupo(grupoId) {
    return this.getPalpitesByUsuario().filter(palpite => palpite.grupo_id == grupoId && palpite.alterado);
  }

  getPalpitesByUsuario(usuarioId?) {
    if(usuarioId)
      return this.palpites.filter(palpite => palpite.usuario_id === usuarioId);
    else
      return this.palpites.filter(palpite => palpite.usuario_id === this.usuarioId);
  }

  savePalpites() {
    this.loaderService.toggle();
    let palpitesAlterados = this.getPalpitesAlterados();
    
    palpitesAlterados.forEach((palpite) => palpite.alterado = false );
    
    this.palpiteEndpointService.saveMany(palpitesAlterados)
      .subscribe((palpites) => {
        this.loadPalpites();
        this.loaderService.toggle();
        this.messageService.success('Palpites Atualizados!');
      });
  }

  getPalpitesAlterados() {
    return this.palpites.filter(palpite => palpite.alterado);
  }

}
