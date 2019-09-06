import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantService } from "../../app/constant.service";

@Injectable()
export class RatingService {
  constructor(private http: HttpClient, public constService: ConstantService) {}

  // API call to save review and rating
  submitReview(body) {
    let authToken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authToken);
    return this.http.post(
      this.constService.API_ENDPOINT + "productRatings",
      body,
      {
        headers: headers
      }
    );
  }
}
