import { Component, OnInit } from '@angular/core';
import { FaseService } from "../../services/fase.service";
import { EquipeService } from "../../services/equipe.service";
import { EventsService } from "angular4-events/esm/src";
import { JogoService } from "../../services/jogo.service";
import { SedeService } from "../../services/sede.service";
import { PalpiteService } from "../../services/palpite.service";

@Component({
  selector: 'app-fases',
  templateUrl: './fases.component.html'
})
export class FasesComponent implements OnInit {
  
  indexFase = 0;
  placarOficial = false;

  constructor(private faseService: FaseService, private equipeService: EquipeService, 
    private jogoService: JogoService, private sedeService: SedeService, 
    private palpiteService: PalpiteService, private pubsub: EventsService,  private events: EventsService) { }

  ngOnInit() {
    this.faseService.loadFases();
    this.sedeService.loadSedes();
    this.palpiteService.loadPalpites();
    this.pubsub.subscribe('palpitesLoaded').subscribe(() => {
        this.equipeService.loadEquipes();
        this.jogoService.loadJogos();
    });

  }

  get fases() {
    return this.faseService.getFases();
  }

  get faseAtual() {
    return this.fases[this.indexFase];
  }

  getJogo(idJogo) {
    return this.jogoService.getJogo(idJogo);
  }

  savePalpites() {
    if(this.placarOficial) {
      this.jogoService.updateJogosModificados();
    } else {
      this.palpiteService.savePalpites();
    }
  }

  placarOficialMode() {
    this.events.publish('placarOficialMode', this.placarOficial);
  }

  nextFase() {
    if(this.canNextFase())
      this.indexFase++;
  }

  prevFase() {
    if(this.canPrevFase())
      this.indexFase--;
  }

  canPrevFase() {
    return this.indexFase != 0;
  }

  canNextFase() {
    return this.indexFase < this.fases.length - 1 && (this.fases[this.indexFase+1].finalizado || this.fases[this.indexFase+1].atual);
  }
}
