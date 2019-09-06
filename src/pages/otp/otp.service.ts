import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantService } from "../../app/constant.service";

@Injectable()
export class OtpService {
  public token: any;
  constructor(
    public http: HttpClient,
    public constantService: ConstantService
  ) {
    this.token = localStorage.getItem("token");
  }

  // API call to send 6 digit OTP to server for passord change
  sendOtp(otp, token) {
    const body = {
      otp: otp
    };

    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", "bearer " + token);
    return this.http.post(
      this.constantService.API_ENDPOINT + "users/password/verification",
      body,
      { headers: headers }
    );
  }
}
