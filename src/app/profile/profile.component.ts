import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
})
export class ProfileComponent implements OnInit {
  BACKEND_URL = environment.apiUrl;

  name: string = "";
  email: string = "";
  location: string = "";
  avatar: string = "";

  constructor(public http: HttpClient, public router: Router) {}

  ngOnInit() {
    this.http.get(this.BACKEND_URL + "/users/user").subscribe((data) => {
      this.name = data["name"];
      this.avatar = data["avatar"];
      this.email = data["email"];
      this.location = data["location"];
    });
  }

  deleteAccount() {
    this.http.delete(this.BACKEND_URL + "/users/me").subscribe(() => {
      this.router.navigate(["/auth/login"]);
    });
  }
}
