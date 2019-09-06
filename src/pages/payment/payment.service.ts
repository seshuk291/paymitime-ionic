import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ConstantService } from "../../app/constant.service";

@Injectable()
export class PaymentService {
  public token: any;
  constructor(
    public http: HttpClient,
    public constantService: ConstantService
  ) {}

  // API call to placing Order
  placeOrder(orderData) {
    const body = orderData;
    let authToken = localStorage.getItem("token");

    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authToken);

    return this.http.post(this.constantService.API_ENDPOINT + "orders", body, {
      headers: headers
    });
  }

  // API call to update order by Id
  savePayemntData(orderId, paymentDetail) {
    const body = {
      payment: paymentDetail
    };
    let authToken = localStorage.getItem("token");
    // console.log("authToen" + authToken);

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

  // API call for payment through stripe
  chargeStripe(token, currency, amount, stripe_secret_key) {
    let secret_key = stripe_secret_key;
    const headers = new HttpHeaders()
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Authorization", "Bearer " + secret_key);
    var params = new HttpParams()
      .set("currency", currency)
      .set("amount", amount)
      .set("description", "description")
      .set("source", token);

    // console.log(params);

    return new Promise(resolve => {
      this.http
        .post("https://api.stripe.com/v1/charges", params, {
          headers: headers
        })
        .subscribe(data => {
          resolve(data);
        });
    });
  }
}
