import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Video} from "../../video";

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.css']
})
export class AddVideoComponent implements OnInit {
  formError: string = ""; // property to hold the form error message
  angForm;
  fileContent: string = '';

  video: Video = new Video();
  constructor(private webService: ApiService, private fb: FormBuilder,  private router: Router) {
    this.angForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(256)]],
      file: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  fileEvent(fileInput: any) {
    this.video.file = fileInput.target.files[0];
  }

  addVideo() {
    this.angForm.markAllAsTouched();
    if (this.angForm.valid) {
      this.video.name = String(this.angForm.controls['name'].value);
      this.video.description = String(this.angForm.controls['description'].value);


      const formData = new FormData();
      formData.append('name', this.video.name);
      formData.append('description', this.video.description);
      formData.append('file', this.video.file, this.video.file.name);

      this.webService.sendVideo(formData).subscribe(
        result => {
          alert("Successfully added video");
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
