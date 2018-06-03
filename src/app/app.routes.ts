
import { Routes } from '@angular/router'
import { FasesComponent } from "./components/fases/fases.component";
import { ClassificacaoComponent } from "./components/classificacao/classificacao.component";
import { ProximosJogosComponent } from "./components/proximos-jogos/proximos-jogos.component";

export const ROUTES: Routes = [
  //{path: "", redirectTo: '/fases', pathMatch: 'full'},
  {path: "", component: ClassificacaoComponent},
  {path: "fases", component: FasesComponent},
  {path: "classificacao", component: ClassificacaoComponent},
  {path: "proximos-jogos", component: ProximosJogosComponent}
]