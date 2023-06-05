import { Component } from '@angular/core';
import {ApiService} from "./api.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {
  title = 'frontend';
  isLoggedIn : boolean = false;
  constructor(private webService: ApiService) {
    this.isLoggedIn = this.webService.getLoginStatus();
    webService.changedLoginState.subscribe(value => this.updateLoggedIn(value));
  }

  updateLoggedIn(value : boolean) {
    this.isLoggedIn = value;
  }

}





