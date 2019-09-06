import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantService } from "../../app/constant.service";

@Injectable()
export class NewPasswordService {
  public token: any;
  constructor(
    public http: HttpClient,
    public constantService: ConstantService
  ) {
    this.token = localStorage.getItem("token");
  }

  //send new password to server
  setNewPassword(password, token) {
    const body = {
      newPass: password
    };
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", "bearer " + token);
    return this.http.post(
      this.constantService.API_ENDPOINT + "users/password/reset",
      body,
      { headers: headers }
    );
  }
}
