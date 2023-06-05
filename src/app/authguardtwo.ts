import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class Authguardtwo implements CanActivate {
  isLoggedIn: boolean = false;

  constructor(private webService: ApiService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.webService.getLoginStatus()) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }

}
