import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantService } from "../../app/constant.service";

@Injectable()
export class ProfileService {
  public token: any;
  constructor(
    public http: HttpClient,
    public constantService: ConstantService
  ) {
    this.token = localStorage.getItem("token");
  }

  // API call to get user detail
  getUserDetails() {
    let authToken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authToken);
    return this.http.get(this.constantService.API_ENDPOINT + "users/me", {
      headers: headers
    });
  }

  // API call to update user detail
  UpdateUserProfile(address: any, userId: any) {
    const body = address;
    let authToken = localStorage.getItem("token");

    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authToken);

    return this.http.put(
      this.constantService.API_ENDPOINT + "users/" + userId,
      body,
      {
        headers: headers
      }
    );
  }
}
