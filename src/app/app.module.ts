import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgHcaptchaModule} from "ng-hcaptcha";
import { LoginComponent } from './login/login.component';
import { NavbarLoggedinComponent } from './navbar-loggedin/navbar-loggedin.component';
import { AddVideoComponent } from './add-video/add-video.component';
import { ViewVideoComponent } from './view-video/view-video.component';
import { MyVideosComponent } from './my-videos/my-videos.component';
import { ManageVideoComponent } from './manage-video/manage-video.component';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    NavbarLoggedinComponent,
    AddVideoComponent,
    ViewVideoComponent,
    MyVideosComponent,
    ManageVideoComponent,
    SearchComponent,
  ],
  imports: [
    NgHcaptchaModule.forRoot({
      siteKey: '10000000-ffff-ffff-ffff-000000000001',
      languageCode: 'en' // optional, will default to browser language
    }),
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
