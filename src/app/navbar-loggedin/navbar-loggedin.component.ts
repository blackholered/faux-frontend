import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar-loggedin',
  templateUrl: './navbar-loggedin.component.html',
  styleUrls: ['./navbar-loggedin.component.css']
})
export class NavbarLoggedinComponent implements OnInit {

  username : string = "";
  constructor(private webService : ApiService, private router: Router) {
    this.username = this.webService.getUsername();
  }

  ngOnInit(): void {
  }

  signOut() {
    this.webService.signout();
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const searchQuery = (event.target as HTMLInputElement).value;
      this.router.navigateByUrl(`/search/${searchQuery}`);
    }
  }
}
