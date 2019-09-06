import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantService } from "../../app/constant.service";

@Injectable()
export class ProductDetailService {
  public token: any;
  constructor(
    public http: HttpClient,
    public constantService: ConstantService
  ) {
    this.token = localStorage.getItem("token");
    console.log("token" + this.token);
  }

  checkFavourite(productId) {
    const body = {
      product: productId
    };
    let authToken = localStorage.getItem("token");

    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authToken);

    return this.http.post(
      this.constantService.API_ENDPOINT + "favourites/check/product",
      body,
      {
        headers: headers
      }
    );
  }

  addFavourite(productId: any, restId: any, locId: any) {
    const body = {
      product: productId,
      restaurantID: restId,
      location: locId
    };
    let authToken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authToken);

    return this.http.post(
      this.constantService.API_ENDPOINT + "favourites",
      body,
      {
        headers: headers
      }
    );
  }

  removeFavourite(Id: any) {
    let authToken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authToken);

    return this.http.delete(
      this.constantService.API_ENDPOINT + "favourites/" + Id,
      {
        headers: headers
      }
    );
  }
}
