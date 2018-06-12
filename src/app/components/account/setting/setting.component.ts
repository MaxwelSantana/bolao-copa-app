import { Component, OnInit } from '@angular/core';
import { TokenPayload, AuthenticationService } from "../../../services/authentication.service";
import { Router } from "@angular/router";
import { USER } from "../../shared/constants/roles.constants";
import { MessageService } from "../../../services/message.service";
import { LoaderService } from "../../../services/loader.service";
import 'rxjs/add/operator/delay';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html'
})
export class SettingComponent implements OnInit { 

  credentials: any = {
    email: '',
    name: ''
  };

  constructor(private auth: AuthenticationService,private messageService: MessageService, private loaderService: LoaderService) {}

  ngOnInit() {
      this.credentials = this.auth.getUserDetails();
  }

  salvarAlteracoes() {
    this.loaderService.toggle();
    this.auth.update(this.credentials).delay(1000).subscribe(() => {
      this.messageService.success('Dados Alterados!');
      this.loaderService.toggle();
    }, (err) => {
      console.error(err);
      this.loaderService.toggle();
    });
  }

  logout() {
      this.auth.logout();
  }

}
