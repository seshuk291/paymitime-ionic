import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantService } from "../../app/constant.service";

@Injectable()
export class CartService {
  public token: any;
  constructor(
    public http: HttpClient,
    public constantService: ConstantService
  ) {}

  //API Call to get Loyality Information of Restaurant by Its id
  getUserLoyaltyPoints(restId: any) {
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    return this.http.get(
      this.constantService.API_ENDPOINT + "settings/" + restId,
      {
        headers: headers
      }
    );
  }
}
