import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { EventsModule } from 'angular4-events';
import { FormsModule } from '@angular/forms';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { GrupoComponent } from './components/grupo/grupo.component';
import { FasesComponent } from './components/fases/fases.component';
import { JogoComponent } from './components/jogo/jogo.component';

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


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GrupoComponent,
    FasesComponent,
    JogoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    EventsModule.forRoot()
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "pt" },
    FaseService, 
    FaseEndpointService, 
    EquipeService, 
    EquipeEndpointService, 
    JogoService, 
    JogoEndpointService,
    SedeService,
    SedeEndpointService,
    PalpiteService,
    PalpiteEndpointService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
