import { FaseEndpointService } from "./fase-endpoint.service";
import { Injectable } from "@angular/core";
import { EventsService } from "angular4-events/esm/src";

@Injectable()
export class FaseService {
    private fases: any[] = [];

    constructor(private faseEndpointService: FaseEndpointService, private events: EventsService){}

    loadFases() {
        this.faseEndpointService.getFases().subscribe(fases => {
            this.fases = fases;
            console.log('publish');
            this.events.publish('fasesLoaded', '');
        });
    }

    getFases() {
        return this.fases;
    }

    getFase(faseId) {
        return this.fases.find(fase => fase.fase_id == faseId);
    }
}