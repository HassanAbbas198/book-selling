import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { Subject } from "rxjs";

import { AuthData } from "./auth-data.model";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/users/";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  private token: string;
  private isAuthenticated = false;
  private userId: string;

  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(name: string, email: string, password: string, confirmPassword) {
    const authData: AuthData = {
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };
    this.http.post(BACKEND_URL + "/signup", authData).subscribe(
      () => {
        this.router.navigate(["/auth/login"]);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(name: string, email: string, password: string, confirmPassword) {
    const authData: AuthData = {
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + "/login",
        authData
      )
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.userId = response.userId;
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(token, expirationDate, this.userId);
            this.router.navigate(["/"]);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  resetPassword(email: string) {
    const data = {
      email: email,
    };
    this.http
      .post<{ status: string }>(BACKEND_URL + "/resetPassword", data)
      .subscribe((response) => {
        const stat = response.status;
        this.router.navigate(["/"]);
      });
  }

  newPassword(cToken: string, password: string) {
    const data = {
      cToken: cToken,
      password: password,
    };
    return this.http
      .post<{ status: string }>(BACKEND_URL + "/newPassword", data)
      .subscribe((response) => {
        const stat = response.status;
        this.router.navigate(["/"]);
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.isAuthenticated = true;

      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(function () {
      this.logout();
    }, duration);
  }

  // storing our data on the local storage(managed by the browser). so reloading wont affect the token
  private saveAuthData(token: string, expiration: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expiration.toISOString());
    localStorage.setItem("userId", userId);
  }

  // clearing the saved data on the local storage
  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }
}
