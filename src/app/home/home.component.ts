import { Component, OnInit } from '@angular/core';
import {Video} from "../../video";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  videos: Video[] = [];
  page = 1;
  limit = 9;

  constructor(private webService: ApiService) {
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.webService
      .getVideos(this.page, this.limit)
      .subscribe((result) => {
        this.videos = result;
      });
  }
  nextPage() {
    this.page++;
    this.getData();
  }

  previousPage() {
    this.page--;
    this.getData();
  }

}
