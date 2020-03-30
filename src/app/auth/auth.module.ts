import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

import { SignupComponent } from "./signup/signup.component";
import { LoginComponent } from "./login/login.component";
import { AngularMaterialModule } from "../angular-material.module";
import { AuthRoutingModule } from "./auth-routing.module";

@NgModule({
  declarations: [SignupComponent, LoginComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    FormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule {}
