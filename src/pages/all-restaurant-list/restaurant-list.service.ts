import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantService } from "../../app/constant.service";

@Injectable()
export class RestaurantListService {
  public token: any;
  constructor(
    public http: HttpClient,
    public constantService: ConstantService
  ) {
    this.token = localStorage.getItem("token");
  }

  // API call to get Restaurant List by latitude and longitude
  getRestaurantsByPosition(latitude?, longitude?) {
    return this.http.get(this.constantService.testApi + "restaurants");
  }

  // API call to get Restaurant List by Rating
  getRestaurantsByRating() {
    return this.http.get(this.constantService.testApi + "restaurants");
  }

  // API call to get Restaurant List by Rating
  getRestaurantAsNewlyArrived() {
    return this.http.get(
      this.constantService.testApi +
        "restaurants"
    );
  }
}
