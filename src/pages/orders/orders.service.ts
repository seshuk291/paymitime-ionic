import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
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
      this.constantService.testApi + "orders",
      {
        headers: headers
      }
    );
  }

  // create a new order
  createOrder(order) {
    return this.http.post(this.constantService.testApi + "orders/", order);
  }

  //API call to get pending orders list
  getPendingOrders() {

    return this.http.get(
      this.constantService.testApi + "orders",
    );
  }

  // get a single order by its is
  getOrderDataById(orderId) {
    // let authToken = localStorage.getItem("token");
    // const headers = new HttpHeaders()
    //   .set("Content-Type", "application/json")
    //   .set("Authorization", authToken);

    return this.http.get(
      this.constantService.testApi + "orders/" + orderId
    );
  }


  checkIfCouponValid(coupon: string) {
    console.log("COUPON", coupon);
    const params = new HttpParams();
    params.append('name', coupon);
    return this.http.get(this.constantService.testApi + `coupons?name=${coupon}`);
  }

  updateOrder(orderId: string, data){
    return this.http.put(this.constantService.testApi + 'orders/' + orderId, data);
  }

}
