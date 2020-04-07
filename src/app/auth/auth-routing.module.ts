// this is called lazy loading, when we dont really need to load everything upfront
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { ResetPsswordComponent } from "./resetPassword/reset-password.component";
import { NewPasswordComponent } from "./new-password/new-password.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "resetPassword", component: ResetPsswordComponent },
  { path: "newPassword/:userId", component: NewPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
