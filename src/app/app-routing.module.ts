import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import {Authguardtwo} from "./authguardtwo";
import {Authguardone} from "./authguardone";
import {SessionCheck} from "./session.check";
import {AddVideoComponent} from "./add-video/add-video.component";
import {ViewVideoComponent} from "./view-video/view-video.component";
import {MyVideosComponent} from "./my-videos/my-videos.component";
import {ManageVideoComponent} from "./manage-video/manage-video.component";
import {SearchComponent} from "./search/search.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [SessionCheck]},
  { path: 'search/:query', component: SearchComponent, canActivate: [SessionCheck]},
  { path: 'view/:id', component: ViewVideoComponent, canActivate: [SessionCheck]},
  { path: 'addvideo', component: AddVideoComponent, canActivate: [SessionCheck, Authguardone]},
  { path: 'myvideos', component: MyVideosComponent, canActivate: [SessionCheck, Authguardone]},
  { path: 'managevideo/:id', component: ManageVideoComponent, canActivate: [SessionCheck, Authguardone]},
  { path: 'register', component: RegisterComponent, canActivate: [SessionCheck, Authguardtwo]},
  { path: 'login', component: LoginComponent, canActivate: [SessionCheck, Authguardtwo]},



  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
