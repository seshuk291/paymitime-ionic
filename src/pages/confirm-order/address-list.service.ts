import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantService } from "../../app/constant.service";

@Injectable()
export class AddressListService {
  public token: any;
  constructor(
    public http: HttpClient,
    public constantService: ConstantService
  ) {}

  getAddressList() {
    let authToken = localStorage.getItem("token");
       const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authToken);

    return this.http.get(
      this.constantService.API_ENDPOINT + "users/newaddress/address",
      {
        headers: headers
      }
    );
  }

  deleteAddress(index) {
    let authToken = localStorage.getItem("token");  

    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authToken);

    return this.http.delete(
      this.constantService.API_ENDPOINT + "users/address/"+index,
      {
        headers: headers
      }
    );
  }
}
