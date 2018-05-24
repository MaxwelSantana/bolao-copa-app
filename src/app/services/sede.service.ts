import { Injectable } from '@angular/core';
import { SedeEndpointService } from "./sede-endpoint.service";
import { EventsService } from "angular4-events/esm/src";

@Injectable()
export class SedeService {

  sedes: any[] = [];

  constructor(private sedeEndpointService: SedeEndpointService, private events: EventsService) { }

  loadSedes() {
    this.sedeEndpointService.getSedes().subscribe(sedes => {
      this.sedes = sedes;
      this.events.publish('sedesLoaded');
    });
  }

  getSedeById(id) {
    return this.sedes.find(sede => sede.sede_id == id);
  }
}
