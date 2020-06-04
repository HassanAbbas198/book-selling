import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AngularMaterialModule } from "../angular-material.module";

import { PostListComponent } from "./post-list/post-list.component";
import { PostCreateComponent } from "./post-create/post-create.component";
import { PostDetailsComponent } from "./post-details/post-details.component";
import { FooterComponent } from "../footer/footer.component";
import { SearchComponent } from "../search/search.component";

@NgModule({
  declarations: [
    PostCreateComponent,
    PostListComponent,
    PostDetailsComponent,
    FooterComponent,
    SearchComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class PostsModule {}
