import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../api.service";
import {Video} from "../../video";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  query: string = "";
  videos: Video[] = [];
  page = 1;
  limit = 9;

  constructor(private route : ActivatedRoute, private webService : ApiService) {
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.query = this.route.snapshot.params['query'];
        this.getData();
      });
  }


  getData() {
    this.webService
      .getVideosBySearch(this.page, this.limit, this.query)
      .subscribe((result) => {
        this.videos = result;
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
