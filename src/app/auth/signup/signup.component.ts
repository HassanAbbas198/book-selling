import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent {
  constructor(public authService: AuthService) {}

  isLoading = false;
  // passMatch = false;

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(
      form.value.name,
      form.value.email,
      form.value.password
    );
  }

  // passwordMatch(form: NgForm) {
  //   if (form.value.password === form.value.confPassword) {
  //     console.log(form.value);
  //     this.passMatch = true;
  //   }
  // }
}
