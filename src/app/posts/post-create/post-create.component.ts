import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import { PostService } from "../post.service";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  constructor(public postsService: PostService) {}

  ngOnInit() {
    // this.postsService.getPostUpdateListener;
  }

  //event listener accepting a form as parameter
  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    //sending the title and content to the addPost method in post.service.ts
    this.postsService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }
}
