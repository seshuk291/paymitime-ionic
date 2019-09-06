import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantService } from "../../app/constant.service";

@Injectable()
export class OrdersService {
  public token: any;
  constructor(
    public http: HttpClient,
    public constantService: ConstantService
  ) {}

  //API call to get delivered or canceled orders list
  getDelivedOrders() {
    let authToken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authToken);

    return this.http.get(
      this.constantService.API_ENDPOINT + "orders/userorder/history",
      {
        headers: headers
      }
    );
  }

  //API call to get pending orders list
  getPendingOrders() {
    let authToken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authToken);

    return this.http.get(
      this.constantService.API_ENDPOINT + "orders/userorder/pending",
      {
        headers: headers
      }
    );
  }

  // get a single order by its is
  getOrderDataById(orderId) {
    let authToken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authToken);

    return this.http.get(
      this.constantService.API_ENDPOINT + "orders/" + orderId,
      {
        headers: headers
      }
    );
  }
}
