import { Component, OnInit } from '@angular/core';
import { TokenPayload, AuthenticationService } from "../../../services/authentication.service";
import { Router } from "@angular/router";
import { USER } from "../../shared/constants/roles.constants";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  credentials: TokenPayload = {
    email: '',
    name: '',
    password: '',
    roles: [USER]
  };

  constructor(private auth: AuthenticationService, private router: Router) {}

  register() {
    this.auth.register(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/');
    }, (err) => {
      console.error(err);
    });
  }

}
