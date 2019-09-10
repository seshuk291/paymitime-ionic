import { Injectable } from "@angular/core";

@Injectable()
export class ConstantService {
  API_ENDPOINT: String;
  Login_Auth: String;
  Socket_Url: String;
  testApi = 'https://sleepy-headland-26492.herokuapp.com/';

  // testApi = 'http://localhost:1337/';

  constructor() {
    // this.Socket_Url = "http://192.168.1.18:9000/";
    // this.Login_Auth = "http://192.168.1.18:9000/";
    // this.API_ENDPOINT = "http://192.168.1.18:9000/api/";

    this.Socket_Url = "https://restaurantsass.herokuapp.com/";
    this.Login_Auth = "https://restaurantsass.herokuapp.com/";
    this.API_ENDPOINT = "https://restaurantsass.herokuapp.com/api/";

  }
}

