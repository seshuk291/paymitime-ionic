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
    const body = {
      latitude: latitude,
      longitude: longitude
    };
    const headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    return this.http.post(
      this.constantService.API_ENDPOINT + "locations/all/map/distance",
      body,
      {
        headers: headers
      }
    );
  }

  // API call to get Restaurant List by Rating
  getRestaurantsByRating() {
    const headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    return this.http.get(
      this.constantService.API_ENDPOINT +
        "locations/toprated/all/restaurant/list",
      {
        headers: headers
      }
    );
  }

  // API call to get Restaurant List by Rating
  getRestaurantAsNewlyArrived() {
    const headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    return this.http.get(
      this.constantService.API_ENDPOINT +
        "locations/newlyadded/all/restaurant/list",
      {
        headers: headers
      }
    );
  }
}
