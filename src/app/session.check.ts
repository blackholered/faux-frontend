import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class SessionCheck implements CanActivate {
  constructor(private webService: ApiService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.webService.checkLoggedStatus(String(this.webService.getToken())).subscribe(response => {
        if (response) {
          this.webService.updateLoginStatus(true);
        } else {
          this.webService.updateLoginStatus(false);
        }
      },
      error => {
        this.webService.updateLoginStatus(false);
       // alert("Something went wrong with the authentication service.");
        //this.router.navigate(['/home']);
      });
    return true;
  }
}
