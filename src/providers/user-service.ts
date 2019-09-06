import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantService } from "../app/constant.service";

@Injectable()
export class UserService {
  public token: any;
  constructor(
    public http: HttpClient,
    public constantService: ConstantService
  ) {}

  getUser() {
    let authToken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authToken);
    return this.http.get(this.constantService.API_ENDPOINT + "users/me", {
      headers: headers
    });
  }
}
