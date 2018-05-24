import { Component, OnInit } from '@angular/core';
import { FaseService } from "../../services/fase.service";
import { EquipeService } from "../../services/equipe.service";
import { EventsService } from "angular4-events/esm/src";
import { JogoService } from "../../services/jogo.service";
import { SedeService } from "../../services/sede.service";

@Component({
  selector: 'app-fases',
  templateUrl: './fases.component.html'
})
export class FasesComponent implements OnInit {
  
  indexFase = 0;

  constructor(private faseService: FaseService, private equipeService: EquipeService, 
    private jogoService: JogoService, private sedeService: SedeService) { }

  ngOnInit() {
    this.faseService.loadFases();
    this.equipeService.loadEquipes();
    this.jogoService.loadJogos();
    this.sedeService.loadSedes();
  }

  get fases() {
    return this.faseService.getFases();
  }

  get faseAtual() {
    return this.fases[this.indexFase];
  }

}
