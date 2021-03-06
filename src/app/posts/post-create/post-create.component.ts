import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { PostService } from "../post.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

interface Entity {
  value: string;
}

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  private mode = "create";
  private postId: string;
  singlePost: Post;
  isLoading = false;

  BACKEND_URL = environment.apiUrl;

  entities: Entity[] = [];

  private authStatusSub: Subscription;

  form: FormGroup;
  imagePreview: string;

  constructor(
    public postsService: PostService,
    public route: ActivatedRoute,
    public authService: AuthService,
    public http: HttpClient
  ) {}

  ngOnInit() {
    this.http.get(this.BACKEND_URL + "/entities").subscribe((data) => {
      const test = this.entities.map((e) => {
        return (e.value = data["name"]);
      });

      console.log(test);
    });

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required],
      }),
      price: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.singlePost = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            price: postData.price,
            imagePath: postData.imagePath,
            creatorId: postData.creatorId,
            creatorName: postData.creatorName,
            date: postData.date,
          };
          this.form.setValue({
            title: this.singlePost.title,
            content: this.singlePost.content,
            price: this.singlePost.price,
            image: this.singlePost.imagePath,
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      // sending the title and content to the addPost method in post.service.ts
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.price,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.price,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  onImagePicked(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  changeEntity(value) {}

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
