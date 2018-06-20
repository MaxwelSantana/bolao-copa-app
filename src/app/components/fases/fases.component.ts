import { Component, OnInit } from '@angular/core';
import { FaseService } from "../../services/fase.service";
import { EquipeService } from "../../services/equipe.service";
import { EventsService } from "angular4-events/esm/src";
import { JogoService } from "../../services/jogo.service";
import { SedeService } from "../../services/sede.service";
import { PalpiteService } from "../../services/palpite.service";
import { ToastrService } from "ngx-toastr";
import { MessageService } from "../../services/message.service";
import { AuthenticationService } from "../../services/authentication.service";
import { LoaderService } from "../../services/loader.service";

@Component({
  selector: 'app-fases',
  templateUrl: './fases.component.html'
})
export class FasesComponent implements OnInit {
  
  indexFase = 0;
  placarOficial = false;

  jogosSubscriber: any;
  loadAllSubscriber: any;
  palpitesSubscriber: any;

  constructor(private faseService: FaseService, private equipeService: EquipeService, private loaderService: LoaderService,
    private jogoService: JogoService, private sedeService: SedeService, private authenticationService: AuthenticationService,
    private palpiteService: PalpiteService, private pubsub: EventsService,  private events: EventsService, private messageService: MessageService) { }

  ngOnInit() {
    this.loadAllSubscriber = this.pubsub.subscribe('loadAll').subscribe(() => {
        this.loadAll();
    });
    this.loadAll();
  }

  loadAll() {
    this.loaderService.toggle();
    this.faseService.loadFases();
    this.sedeService.loadSedes();
    this.palpiteService.loadPalpites();
    this.jogosSubscriber = this.pubsub.subscribe('jogosLoaded').subscribe(() => {
        this.loaderService.toggle();
    });
    this.palpitesSubscriber = this.pubsub.subscribe('palpitesLoaded').subscribe(() => {
        this.equipeService.loadEquipes();
        this.jogoService.loadJogos();
    });
  }

  ngOnDestroy() {
    this.jogosSubscriber.unsubscribe();
    this.loadAllSubscriber.unsubscribe();
    this.palpitesSubscriber.unsubscribe();
  }

  resetPalpites() {
    this.palpiteService.resetPalpitesByUsuario();
  }

  get hasModification() {
    return this.palpiteService.getPalpitesAlterados().length > 0 || this.isAdmin; 
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
    if(this.isAdmin) {
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
    console.log(this.faseAtual);
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

  get isAdmin() {
    return this.authenticationService.getUserDetails().roles.includes('ROLE_ADMIN');
  }
}
