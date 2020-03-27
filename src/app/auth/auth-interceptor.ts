import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from "@angular/common/http";

import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();
    //overriding the authorization header in my request and cloning the updated req to authRequest
    const authRequest = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + authToken)
    });
    return next.handle(authRequest);
  }
}
