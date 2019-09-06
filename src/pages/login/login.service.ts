import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantService } from "../../app/constant.service";
import "rxjs/add/operator/catch";

@Injectable()
export class LoginService {
  constructor(
    public http: HttpClient,
    public constantService: ConstantService
  ) {}

  // send login credention to server
  onLoginData(loginData: any) {
    const body = loginData;
    const headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    return this.http.post(
      this.constantService.Login_Auth + "auth/local",
      body,
      {
        headers: headers
      }
    );
  }

  // send facebook user details of user to server
  loginUserViaFacebook(register: any) {
    console.log("user data in serveice" + JSON.stringify(register));
    const body = register;
    const headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    return this.http.post(
      this.constantService.API_ENDPOINT + "users/auth/facebook",
      body,
      {
        headers: headers
      }
    );
  }

  //send google user details of user to server
  loginUserViaGoogle(register: any) {
    console.log("user data in serveice" + JSON.stringify(register));
    const body = register;
    const headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    return this.http.post(
      this.constantService.API_ENDPOINT + "users/auth/google",
      body,
      {
        headers: headers
      }
    );
  }
}
