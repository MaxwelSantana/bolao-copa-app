import { Component, OnInit } from '@angular/core';
import { EventsService } from "angular4-events/esm/src";
import { UserEndpointService } from "../../services/user-endpoint.service";
import { PalpiteService } from "../../services/palpite.service";
import { PLAYER } from "../shared/constants/roles.constants";

@Component({
  selector: 'app-classificacao',
  templateUrl: './classificacao.component.html'
})
export class ClassificacaoComponent implements OnInit {

  usuarios: any[] = [];

  pontuacaoVazia = {
    placar_correto: 0,
    resultado_correto: 0,
    resultado_errado: 0
  };

  selectedUser: any = null;

  constructor(private userEndpointService: UserEndpointService, private palpiteService:PalpiteService,  private pubsub: EventsService) { }

  ngOnInit() {
    this.userEndpointService.getUsers().subscribe(usuarios => {
        this.setUsuarios(usuarios);
    });
    this.palpiteService.loadPalpites();
    this.pubsub.subscribe('palpitesLoaded').subscribe(() => {
        this.updatePontuacao();
    });
  }

  setUsuarios(usuarios) {
    this.usuarios = usuarios.filter(usuario => usuario.roles.includes(PLAYER));
  }

  updatePontuacao() {
    this.usuarios.forEach(usuario => {
      let palpites = this.palpiteService.getPalpitesByUsuario(usuario._id);
      usuario.pontuacao = {
        placar_correto: palpites.reduce(function(total, palpite) { return palpite.placar_correto ? total+1 : total}, 0),
        resultado_correto: palpites.reduce(function(total, palpite) { return palpite.resultado_correto ? total+1 : total}, 0),
        resultado_errado: palpites.reduce(function(total, palpite) { return palpite.resultado_errado ? total+1 : total}, 0),
      };
    });
    this.sort();
  }

  getPontuacao(usuario) {
    let placar_correto = usuario.pontuacao ? usuario.pontuacao.placar_correto : 0;
    let resultado_correto = usuario.pontuacao ? usuario.pontuacao.resultado_correto : 0;
    return (placar_correto * 3) + resultado_correto;
  }

  selectUser(usuario) {
    this.selectedUser = usuario;
  }

  sort() {
    this.usuarios.sort((user1, user2) => {
      return this.getPontuacao(user2) - this.getPontuacao(user1);
    });
  }
}
