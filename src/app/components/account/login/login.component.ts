import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from "../../../services/authentication.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  credentials: TokenPayload = {
    email: '',
    password: ''
  };

  error = "";

  constructor(private auth: AuthenticationService, private router: Router) {}

  login() {
    this.auth.login(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/fases');
    }, (err) => {
      if(err.error.message == "User not found")
        this.error = "Usuário não encontrado";
      console.error(err);
    }); 
  }

}
