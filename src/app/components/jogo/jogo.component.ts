import { Component, OnInit, Input } from '@angular/core';
import { SedeService } from "../../services/sede.service";

@Component({
  selector: 'app-jogo',
  templateUrl: './jogo.component.html'
})
export class JogoComponent implements OnInit {

  @Input("jogo")
  jogo: any;
  
  constructor(private sedeService: SedeService) { }

  ngOnInit() {
  }

  get sede() {
    return this.sedeService.getSedeById(this.jogo.sede_id);
  }
}
