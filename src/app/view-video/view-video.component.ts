import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Video} from "../../video";
import {CommentObject} from "../../commentObject";
import {debounceTime, fromEvent, Observable, Subject, switchMap, takeUntil} from "rxjs";
import videojs from 'video.js';
import {map} from "rxjs/operators";
import {Comment} from "@angular/compiler";
@Component({
  selector: 'app-view-video',
  templateUrl: './view-video.component.html',
  styleUrls: ['./view-video.component.css']
})
export class ViewVideoComponent implements OnInit, AfterViewInit, OnDestroy {

  public player: any;
  video: Video = new Video();
  id: number = 0;
  isDataAvailable : boolean = false;

  offset: number = 0;
  limit: number = 0;
  totalComments: number = 0;
  comments: CommentObject[] = [];
  destroyed$ = new Subject();
  commentError : boolean = false;
  angForm;
  loggedIn : boolean = false;

  constructor(private webService: ApiService, private fb: FormBuilder,  private router: Router, private route: ActivatedRoute) {
    this.id = this.route.snapshot.params['id'];
    this.offset = 0;
    this.limit = 1;
    this.angForm = this.fb.group({
      commentBody: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(1024)]],
    });
    this.loggedIn = this.webService.getLoginStatus();

  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    if (this.player) {
      this.player.dispose();
    }
  }


addComment() {
  this.angForm.markAllAsTouched();
  if (this.angForm.valid) {


    const commentDTO = {
      video: Number(this.id),
      comment: String(this.angForm.controls['commentBody'].value),
    };

    this.webService.sendComment(commentDTO).subscribe(
      result => {
        alert("Your comment was submitted");
        let comment = new CommentObject();
        comment.user.username = this.webService.getUsername();
        comment.comment = String(this.angForm.controls['commentBody'].value);
        comment.datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        this.comments.unshift(comment);
      },
      error => {
        alert(this.webService.formError);
      }
    );
  }
}


  loadComments() {
    this.webService
      .getCommentByVideoID(this.id, this.offset, this.limit)
      .subscribe((newComments: CommentObject[]) => {
          newComments.forEach(comment => {
            comment.datetime = new Date(Number(comment.datetime) * 1000).toISOString().slice(0, 19).replace('T', ' ');
            this.comments.push(comment);
          });
          console.log(this.comments);
          if (this.offset < this.totalComments) {
            this.offset += this.limit;
            this.loadComments();
          }
        },
        error => {
          this.commentError = true;
        });
  }

  loadCommentCount() {
    this.webService
      .getCommentCountByVideoID(this.id)
      .subscribe((result) => {
        this.totalComments = Number(result.message);
      });
  }

  ngOnInit() {
    this.loadCommentCount();
    this.loadComments();

    const container = document.querySelector('#comments-container') as HTMLElement;

    fromEvent(container, 'wheel')
      .pipe(
        takeUntil(this.destroyed$),

  )
      .subscribe((event: any) => {
       // console.log('scrolling')
        const container = event.target;
        if (container.scrollHeight - container.clientHeight <= container.scrollTop + 1) {
          if (this.offset + this.limit < this.totalComments) {
            this.offset += this.limit;
            this.loadComments();
          }
        }
      });
  }


  ngAfterViewInit() {
    this.webService.getVideoByID(this.id).subscribe(
      result => {
        console.log("fetching video");
        this.video = result;
        this.isDataAvailable = true;
        const options = {
          'sources' : [{
            'src' : "http://localhost:8080/videos/uploads/" + this.video.file + ".mp4",
            'type' : 'video/mp4'
          }
          ],
          'poster' : "http://localhost:8080/videos/uploads/" + this.video.file + ".png",
        };
        this.player = videojs('HTML5Video', options, function () {
          console.log('We are ready!');
          this.play();
        })
        console.log('Here');
      },
      error => {
        alert("An error occurred while fetching the video.")
        this.router.navigate(['/home']);
      }
    );
  }

}
