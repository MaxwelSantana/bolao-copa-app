import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const authorities = route.data['authorities'];

    return this.checkLogin(authorities, state.url);
  }

  checkLogin(authorities: string[], url: string): boolean {
    
    if (this.authenticationService.isLoggedIn()) { 
        if(!authorities || authorities.length === 0) {
            return true;
        }

        for (let i = 0; i < authorities.length; i++) {
            if(this.authenticationService.getUserDetails().roles.includes(authorities[i])) {
                return true;
            }
        }
    }

    this.authenticationService.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }
}