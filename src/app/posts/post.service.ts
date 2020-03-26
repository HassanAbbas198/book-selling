import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Post } from "./post.model";

import { Subject, pipe } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
//handling all the posts services in a class and exporting it
export class PostService {
  //creating an array of type Post (interface)
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  //getting all the posts from the API
  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        "http://localhost:3000/api/posts" + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      //transformedposts is the returned value of the pipe.. we tranformed it to get the id
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    /*this will return the observable we're getting from the httpClient
    so we can subscribe in the component*/
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>("http://localhost:3000/api/posts/" + id);

    //this will return the post from the local array
    // return { ...this.posts.find(p => p.id === id) };
  }

  //adding post method taking title, content, img as arguments
  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    //sending a POST request to app.js
    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postData
      )
      //receiving a JSON (responseData) and expecting a postId
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    // we are returning as an Observable and then we can subscribe in the post-list comp
    return this.http.delete("http://localhost:3000/api/posts/" + postId);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    this.http
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }
}
