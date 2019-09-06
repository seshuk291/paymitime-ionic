import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantService } from "../../app/constant.service";

@Injectable()
export class ChatService {
  public token: any;
  constructor(
    public http: HttpClient,
    public constantService: ConstantService
  ) {}

  //API call to get all restaurant list chated by user
  getAllManagerChatList() {
    let authToken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authToken);
    return this.http.get(
      this.constantService.API_ENDPOINT + "messages/managers/list/by/user",
      {
        headers: headers
      }
    );
  }

  // API call to get Restaurant by id for restautant detail
  getResturant(id) {
    let authToken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authToken);
    return this.http.get(
      this.constantService.API_ENDPOINT + "locations/" + id,
      {
        headers: headers
      }
    );
  }

  //API call to get all chat messages of restaurant by its id
  getResturantMessage(id, pageno) {
    let authToken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authToken);
    return this.http.get(
      this.constantService.API_ENDPOINT +
        "messages/owner/manager/" +
        id +
        "/" +
        pageno,
      {
        headers: headers
      }
    );
  }

  // API call to get user detail
  getUser() {
    let authToken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authToken);
    return this.http.get(this.constantService.API_ENDPOINT + "users/me", {
      headers: headers
    });
  }

  //API call to post a message to Resturant
  sendMessage(chatData) {
    const body = JSON.stringify(chatData);
    let authToken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authToken);
    return this.http.post(
      this.constantService.API_ENDPOINT + "messages/",
      body,
      {
        headers: headers
      }
    );
  }
}
