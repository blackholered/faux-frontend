import { Component, OnInit } from '@angular/core';
import {Video} from "../../video";
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-videos',
  templateUrl: './my-videos.component.html',
  styleUrls: ['./my-videos.component.css']
})
export class MyVideosComponent implements OnInit {
  videos: Video[] = [];
  formError : string = "";

  constructor(private webService : ApiService, private router : Router) { }

  ngOnInit(): void {
    this.getData();
  }

  manageVideo(id : number) {
    this.router.navigate(['/managevideo/', id]);
  }


  deleteVideo(id: number) {
    this.webService.deleteVideo(id).subscribe(
      result => {
        alert("Successfully deleted video");
        this.router.navigate(['/home']);
      },
      error => {
        this.formError = this.webService.formError;
        console.log(this.formError);
      }
    );
  }



  getData() {
    this.webService
      .getVideosByUser()
      .subscribe((result) => {
        this.videos = result;
      },
        error => {
          this.formError = this.webService.formError;
          console.log(this.formError);
        });
  }

}
