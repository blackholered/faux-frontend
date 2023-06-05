import { Component, OnInit } from '@angular/core';
import {User} from "../../user";
import {ApiService} from "../api.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User = new User();
  angForm;
  formError: string = ""; // property to hold the form error message
  constructor(private webService: ApiService, private fb: FormBuilder,  private router: Router) {
    this.angForm = this.fb.group({
      username: [''],
      password: [''],
    });
  }


  ngOnInit(): void {
  }

  login(): void {
    this.user.username = String(this.angForm.controls['username'].value);
    this.user.password = String(this.angForm.controls['password'].value);
    this.webService.login(this.user).subscribe(response => {
    this.webService.setToken(this.user, response);
    this.webService.updateLoginStatus(true);
    this.router.navigate(['/home']);

      },
    error => {
      this.formError = this.webService.formError;
      console.log(this.formError);
    });
  }


}
