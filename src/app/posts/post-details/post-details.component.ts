import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { PostService } from "../post.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { Post } from "../post.model";

@Component({
  selector: "app-post-details",
  templateUrl: "./post-details.component.html",
  styleUrls: ["./post-details.component.css"],
})
export class PostDetailsComponent implements OnInit, OnDestroy {
  singlePost: Post;
  private postId: string;

  isLoading = false;
  userIsAuthenticated = false;
  userId: string;

  isFavorite: boolean;

  private authStatusSub: Subscription;
  private favPostsSub: Subscription;

  constructor(
    public postsService: PostService,
    public authService: AuthService,
    public route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
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
        });
      }
    });

    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

    this.favPostsSub = this.postsService
      .getFavoriteChangedListener()
      .subscribe((isFav) => {
        this.isFavorite = isFav;
        console.log(this.isFavorite);
      });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(
      () => {
        this.router.navigate(["/"]);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onFavorite(postId: string) {
    if (this.isFavorite) {
      this.isFavorite = false;
    } else {
      this.isFavorite = true;
    }
    this.postsService.addToFavorite(postId, this.isFavorite);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe;
    this.favPostsSub.unsubscribe;
  }
}
