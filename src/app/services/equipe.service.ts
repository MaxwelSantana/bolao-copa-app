import { Injectable } from '@angular/core';
import { EquipeEndpointService } from "./equipe-endpoint.service";
import { EventsService } from "angular4-events/esm/src";

@Injectable()
export class EquipeService {

  private equipes: any[] = [];

  constructor(private equipeEndpointService: EquipeEndpointService, private events: EventsService){}

  loadEquipes() {
      this.equipeEndpointService.getEquipes().subscribe(equipes => {
        this.equipes = equipes;
        this.events.publish('equipesLoaded');
      });
  }

  getEquipes() {
      return this.equipes;
  }

  getEquipe(id) {
    return this.equipes.find(equipe => equipe.equipe_id == id);
  }

  getEquipesByIds(ids: number[]) {
    return this.equipes.filter(equipe => ids.some(id => equipe.equipe_id == id));
  }

}
