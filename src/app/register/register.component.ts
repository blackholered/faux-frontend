import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {User} from "../../user";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  formError: string = ""; // property to hold the form error message
  angForm;
  verified: boolean = false;
  captchaToken: string = "";
  captchaError: boolean = false;

  user: User = new User();
  constructor(private webService: ApiService, private fb: FormBuilder,  private router: Router) {
    this.angForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)
      ]],
      email: ['', [Validators.required, Validators.email]],
    });
  }


  ngOnInit(): void {
  }

  onVerify(token: string) {
    this.verified = true;
    this.captchaToken = token;
    console.log("Verified captcha response");
  }

  onExpired(response: any) {
    this.captchaError = true;
    this.verified = false;
  }

  onError(error: any) {
    this.captchaError = true;
    this.verified = false;
  }

  register(): void {
    this.angForm.markAllAsTouched();
    this.captchaError = !this.verified;

    if (this.angForm.valid && this.verified) {
        this.user.username = String(this.angForm.controls['username'].value);
        this.user.password = String(this.angForm.controls['password'].value);
        this.user.email = String(this.angForm.controls['email'].value);
      this.webService.addUser(this.user, this.captchaToken).subscribe(
        result => {
          console.log("added user");
          this.router.navigate(['/login']);
        },
        error => {
          this.formError = this.webService.formError;
          console.log(this.formError);
        }
      );
    }
  }

}
