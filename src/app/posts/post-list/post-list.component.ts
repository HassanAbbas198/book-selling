import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";

import { Subscription } from "rxjs";

import { Post } from "../post.model";
import { PostService } from "../post.service";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];

  private postsSub: Subscription;

  isLoading = false;

  isFavorite = false;
  favToolTip = "Add to favorites";

  // for pagination
  totalPosts = 0;
  postsPerPage = 4;
  currentPage = 1;
  pageSizeOptions = [2, 4, 6, 10];

  constructor(
    public postsService: PostService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  // onFavorite(postId: string) {
  //   if (this.isFavorite) {
  //     this.isFavorite = false;
  //     this.favToolTip = "Add to favorites";
  //   } else {
  //     this.isFavorite = true;
  //     this.favToolTip = "Remove from favorites";
  //   }
  // }

  ngOnDestroy() {
    this.postsSub.unsubscribe;
  }
}
