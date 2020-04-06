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
  private cToken: string;

  // userIsAuthenticated = false;
  // userId: string;

  constructor(
    public authService: AuthService,
    public route: ActivatedRoute,
    private router: Router
  ) {}

  // private authStatusSub: Subscription;

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("token")) {
        this.cToken = paramMap.get("token");
      }
    });

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
    this.authService.newPassword(this.cToken, form.value.password);
  }

  ngOnDestroy() {
    // this.authStatusSub.unsubscribe;
  }
}
