import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantService } from "../../app/constant.service";

@Injectable()
export class CancelService {
  public token: any;
  constructor(
    public http: HttpClient,
    public constantService: ConstantService
  ) {
    this.token = localStorage.getItem("token");
  }

  //API call to Update order Status by Id
  updateOrderStatus(orderId: any) {
    const body = {
      status: "Cancel"
    };
    let authToken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authToken);

    return this.http.put(
      this.constantService.API_ENDPOINT + "orders/" + orderId,
      body,
      {
        headers: headers
      }
    );
  }
}
