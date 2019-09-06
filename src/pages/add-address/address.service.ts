import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantService } from "../../app/constant.service";

@Injectable()
export class AddressService {
  public token: any;
  constructor(
    public http: HttpClient,
    public constantService: ConstantService
  ) {
    this.token = localStorage.getItem("token");
  }

  //API call to Add Address
  addAddress(address: any) {
    const body = address;
    let authToken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authToken);

    return this.http.post(
      this.constantService.API_ENDPOINT + "users/add/address",
      body,
      {
        headers: headers
      }
    );
  }
}
