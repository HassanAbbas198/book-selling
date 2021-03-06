import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "./auth/auth.guard";
import { AuthModule } from "./auth/auth.module";

import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { PostDetailsComponent } from "./posts/post-details/post-details.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { EducationalEntityComponent } from "./educational-entity/educational-entity.component";
import { ProfileComponent } from "./profile/profile.component";

const routes: Routes = [
  { path: "", component: PostListComponent },
  { path: "create", component: PostCreateComponent, canActivate: [AuthGuard] },
  {
    path: "edit/:postId",
    component: PostCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "post-details/:postId",
    component: PostDetailsComponent,
  },

  {
    path: "entity",
    component: EducationalEntityComponent,
  },

  {
    path: "profile",
    component: ProfileComponent,
  },

  {
    path: "favorites",
    component: PostListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./auth/auth.module").then((module) => module.AuthModule),
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
