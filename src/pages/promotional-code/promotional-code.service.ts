import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantService } from "../../app/constant.service";

@Injectable()
export class PromotionalCodeService {
  constructor(
    public http: HttpClient,
    public constantService: ConstantService
  ) {}

  // API call to get all coupons based on resturant id
  getPromoCodes(id: string) {
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.get(
      this.constantService.API_ENDPOINT +
        "coupons/validcoupon/bycurrenttimestamp/" +
        id,
      {
        headers: headers
      }
    );
  }
}
