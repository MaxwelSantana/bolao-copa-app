
import { Routes } from '@angular/router'
import { FasesComponent } from "./components/fases/fases.component";
import { ClassificacaoComponent } from "./components/classificacao/classificacao.component";
import { ProximosJogosComponent } from "./components/proximos-jogos/proximos-jogos.component";
import { LoginComponent } from "./components/account/login/login.component";
import { AuthGuard } from "./services/auth-guard.service";
import { RegisterComponent } from "./components/account/register/register.component";
import { SettingComponent } from "./components/account/setting/setting.component";
import { USER } from "./components/shared/constants/roles.constants";

export const ROUTES: Routes = [
  //{path: "", redirectTo: '/fases', pathMatch: 'full'},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "account", component: SettingComponent},
  {path: "", component: ClassificacaoComponent, data: { authorities: [USER] }, canActivate: [AuthGuard]},
  {path: "fases", component: FasesComponent, data: { authorities: [USER] }, canActivate: [AuthGuard] },
  {path: "classificacao", component: ClassificacaoComponent, data: { authorities: [USER] }, canActivate: [AuthGuard]},
  {path: "proximos-jogos", component: ProximosJogosComponent, data: { authorities: [USER] }, canActivate: [AuthGuard]}
]