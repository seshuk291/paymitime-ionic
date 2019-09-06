import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ConstantService } from "../../app/constant.service";

@Injectable()
export class RestaurantDetailService {

  apiUrl = this.constantService.testApi;

  constructor(
    public http: HttpClient,
    public constantService: ConstantService
  ) {}

  getRestaurantById(id: any) {
    const headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    return this.http.get(
      this.apiUrl + "restaurants/" + id,
      {
        headers: headers
      }
    );
  }

  getAllItemsByRestaurantId(restaurant_id:string) {
    // const headers = new HttpHeaders();
    const params = new HttpParams();
    params.append("restaurant", restaurant_id);
    // headers.set("Content-Type", "application/json");
    return this.http.get(this.apiUrl + "items", { params: params });
  }

  getlocationById(id: any) {
    //let authToken = localStorage.getItem("token");

    const headers = new HttpHeaders().set("Content-Type", "application/json");
    //  .set("Authorization", authToken);
    return this.http.get(
      this.apiUrl + "locations/" + id,
      {
        headers: headers
      }
    );
  }

  checkValidToken() {
    let authToken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authToken);
    return this.http.get(
      this.constantService.API_ENDPOINT + "users/verify/token",
      {
        headers: headers
      }
    );
  }
}
