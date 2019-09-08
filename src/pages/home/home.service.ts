import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConstantService } from '../../app/constant.service';
import { map } from 'rxjs-compat/operator/map';

@Injectable()
export class HomeService {
  headers = new HttpHeaders();
  apiUrl = this.constantService.testApi;

  constructor(
    public http: HttpClient,
    public constantService: ConstantService
  ) {
    console.log("API URL", this.apiUrl);
  }

  //API call to get all Restaurant list based on latitude and longitude
  getRestaurantsByPosition(latitude?, longitude?) {
    // const body = {
    //   latitude: latitude,
    //   longitude: longitude,
    //   page: 1
    // };

    this.headers.set('Content-Type', 'application/json');
    return this.http.get(this.apiUrl + 'restaurants', {
      headers: this.headers
    });
  }

  //API call to get all Restaurant list based on Ratings
  getRestaurantsByRating() {
    this.headers.set('Content-Type', 'application/json');
    return this.http.get(this.apiUrl + 'restaurants', {
      headers: this.headers
    });
  }

  //API call to get all Restaurant list, newly arrived
  getRestaurantAsNewlyArrived() {
    this.headers.set('Content-Type', 'application/json');
    return this.http.get(this.apiUrl + 'restaurants', {
      headers: this.headers
    });
  }
}
