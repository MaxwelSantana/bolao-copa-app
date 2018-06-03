import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-classificacao',
  templateUrl: './classificacao.component.html'
})
export class ClassificacaoComponent implements OnInit {

  usuarios: any[] = [
    { nickname: "Maxwel" },
    { nickname: "Muca" },
    { nickname: "Valber" },
    { nickname: "Popeye" },
    { nickname: "Jorginho" }
  ];
  constructor() { }

  ngOnInit() {
  }

}
