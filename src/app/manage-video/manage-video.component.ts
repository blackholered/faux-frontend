import { Component, OnInit } from '@angular/core';
import {Video} from "../../video";
import {ApiService} from "../api.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-manage-video',
  templateUrl: './manage-video.component.html',
  styleUrls: ['./manage-video.component.css']
})
export class ManageVideoComponent implements OnInit {
  video: Video = new Video();
  angForm;
  id: number = 0;
  formError: string = "";
  constructor(private webService: ApiService, private fb: FormBuilder,  private router: Router, private route: ActivatedRoute) {
    this.angForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(256)]],
    });
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.webService.getVideoBySession(Number(this.id)).subscribe(
      result => {
        this.angForm.controls['name'].setValue(result.name);
        this.angForm.controls['description'].setValue(result.description);
        },
      error => {
        alert(this.webService.formError);
        this.router.navigate(['/home']);
      }
    );
  }

  updateVideo() {
    this.angForm.markAllAsTouched();
    if (this.angForm.valid) {
      this.video.id = this.id;
      this.video.name = String(this.angForm.controls['name'].value);
      this.video.description = String(this.angForm.controls['description'].value);

      const videoDTO = {
        id: Number(this.id),
        name: String(this.angForm.controls['name'].value),
        description: String(this.angForm.controls['description'].value)
      };

      this.webService.updateVideo(videoDTO).subscribe(
        result => {
          alert("Successfully updated video");
          this.router.navigate(['/home']);
        },
        error => {
          this.formError = this.webService.formError;
          console.log(this.formError);
        }
      );
    }
  }



}
