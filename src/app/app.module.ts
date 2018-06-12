import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from '@angular/router';
import { EventsModule } from 'angular4-events';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);

import { ROUTES } from "./app.routes";
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { GrupoComponent } from './components/fases/grupo/grupo.component';
import { FasesComponent } from './components/fases/fases.component';
import { JogoComponent } from './components/jogo/jogo.component';
import { ClassificacaoComponent } from './components/classificacao/classificacao.component';
import { ProximosJogosComponent } from './components/proximos-jogos/proximos-jogos.component';
import { ChaveComponent } from './components/fases/chave/chave.component';
import { LoginComponent } from './components/account/login/login.component';
import { RegisterComponent } from "./components/account/register/register.component";
import { SettingComponent } from './components/account/setting/setting.component';
import { LoaderComponent } from './components/shared/loader/loader.component';

import { FaseService } from './services/fase.service';
import { FaseEndpointService } from './services/fase-endpoint.service';
import { EquipeEndpointService } from "./services/equipe-endpoint.service";
import { EquipeService } from "./services/equipe.service";
import { JogoEndpointService } from "./services/jogo-endpoint.service";
import { JogoService } from "./services/jogo.service";
import { SedeEndpointService } from "./services/sede-endpoint.service";
import { SedeService } from "./services/sede.service";
import { PalpiteEndpointService } from "./services/palpite-endpoint.service";
import { PalpiteService } from "./services/palpite.service";
import { AuthenticationService } from "./services/authentication.service";
import { AuthGuard } from "./services/auth-guard.service";
import { LoaderService } from "./services/loader.service";
import { MessageService } from "./services/message.service";
import { UserService } from "./services/user.service";
import { UserEndpointService } from "./services/user-endpoint.service";

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GrupoComponent,
    FasesComponent,
    JogoComponent,
    ClassificacaoComponent,
    ProximosJogosComponent,
    ChaveComponent,
    LoginComponent,
    RegisterComponent,
    SettingComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(ROUTES),
    EventsModule.forRoot(),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    ToastrModule.forRoot({
      timeOut: 1000,
      positionClass: 'toast-bottom-full-width',
      preventDuplicates: true,
      progressBar: true,
      progressAnimation: 'increasing'
    }),
    BrowserAnimationsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "pt" },
    AuthenticationService,
    AuthGuard,
    FaseService, 
    FaseEndpointService, 
    EquipeService, 
    EquipeEndpointService, 
    JogoService, 
    JogoEndpointService,
    SedeService,
    SedeEndpointService,
    PalpiteService,
    PalpiteEndpointService,
    UserService,
    UserEndpointService,
    LoaderService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
