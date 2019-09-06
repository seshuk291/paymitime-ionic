import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantService } from "../../app/constant.service";

@Injectable()
export class ForgetPasswordService {
  public token: any;
  constructor(
    public http: HttpClient,
    public constantService: ConstantService
  ) {
    this.token = localStorage.getItem("token");
  }

  // API call to send OTP
  forgetPassword(email) {
    const body = {
      email: email
    };
    console.log("call", email);

    const headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(
      this.constantService.API_ENDPOINT + "users/password/otp",
      body,
      { headers: headers }
    );
  }
}
