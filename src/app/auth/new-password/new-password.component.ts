import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-new-password",
  templateUrl: "./new-password.component.html",
  styleUrls: ["./new-password.component.css"],
})
export class NewPasswordComponent implements OnInit, OnDestroy {
  isLoading = false;
  userId: string;

  // userIsAuthenticated = false;
  // userId: string;
  private authStatusSub: Subscription;

  constructor(
    public authService: AuthService,
    public route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get("userId");

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
    // this.route.paramMap.subscribe((paramMap: ParamMap) => {
    //   if (paramMap.has("userId")) {
    //     this.userId = paramMap.get("userId");
    //     console.log(this.userId);
    //   }
    // });
    // this.userId = this.authService.getUserId();
    // this.userIsAuthenticated = this.authService.getIsAuth();
    // this.authStatusSub = this.authService
    //   .getAuthStatusListener()
    //   .subscribe((isAuthenticated) => {
    //     this.userIsAuthenticated = isAuthenticated;
    //     this.userId = this.authService.getUserId();
    //   });
    // console.log(this.userId);
  }

  onUpdate(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.newPassword(
      this.userId,
      form.value.password,
      form.value.confirmPassword
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
