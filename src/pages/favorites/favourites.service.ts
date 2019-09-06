import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantService } from "../../app/constant.service";

@Injectable()
export class FavouriteService {
  public token: any;
  constructor(
    public http: HttpClient,
    public constantService: ConstantService
  ) {
    this.token = localStorage.getItem("token");
    // console.log("token" + this.token);
  }

  // API call to get user FavouriteList
  getUserFavouriteList() {
    let authToken = localStorage.getItem("token");

    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authToken);

    return this.http.get(this.constantService.API_ENDPOINT + "favourites", {
      headers: headers
    });
  }

  // API call to Remove item from user's FavouriteList
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
