import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController
} from "ionic-angular";

import { RestaurantListService } from "./restaurant-list.service";

@IonicPage()
@Component({
  selector: "page-all-restaurant-list",
  templateUrl: "all-restaurant-list.html",
  providers: [RestaurantListService]
})
export class AllRestaurantPage {
  event: string;
  searchBoxVisible = false;
  btnsVisible = true;
  public restaurantList: any[] = [];
  private pageValue: string;
  public pageHeaderTitle: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public restListService: RestaurantListService,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.pageValue = this.navParams.get("pageValue");
    //Get location by lat/long from localStorage
    if (this.pageValue == "position") {
      this.pageHeaderTitle = "Near By Restaurants";
      if (localStorage.getItem("position") != null) {
        const prevPosition = JSON.parse(localStorage.getItem("position"));
        const index = prevPosition.length;
        const singlePosition = prevPosition[index - 1];

        this.getRestaurantsByPosition(singlePosition.lat, singlePosition.long);
      } else {
        this.getRestaurantsByPosition(12.917, 77.58); //static location
      }
    } else if (this.pageValue == "rating") {
      this.pageHeaderTitle = "Top Rated Restaurants";
      this.getRestaurantsByRating();
    } else {
      this.pageHeaderTitle = "Newly Arrived Restaurants";
      this.getRestaurantAsNewlyArrived();
    }
  }

  // Used for get Restaurant List by latitude and longitude
  getRestaurantsByPosition(lat, long) {
    let loader = this.loadingCtrl.create({
      content: "please wait"
    });
    loader.present();
    this.restListService.getRestaurantsByPosition(lat, long).subscribe(
      (res: any) => {
        if (res.message) {
          loader.dismiss();
        } else {
          this.restaurantList = res;
          loader.dismiss();
        }
      },
      error => {
        loader.dismiss();
      }
    );
  }

  // Used for get Restaurant List based on Rating
  getRestaurantsByRating() {
    let loader = this.loadingCtrl.create({
      content: "please wait"
    });
    loader.present();
    this.restListService.getRestaurantsByRating().subscribe(
      (res: any) => {
        if (res.message) {
          loader.dismiss();
        } else {
          this.restaurantList = res;
          loader.dismiss();
        }
      },
      error => {
        loader.dismiss();
      }
    );
  }

  // Used for get Newly Opened Restaurant List
  getRestaurantAsNewlyArrived() {
    let loader = this.loadingCtrl.create({
      content: "please wait"
    });
    loader.present();
    this.restListService.getRestaurantAsNewlyArrived().subscribe(
      (res: any) => {
        if (res.message) {
          loader.dismiss();
        } else {
          this.restaurantList = res;
          loader.dismiss();
        }
      },
      error => {
        loader.dismiss();
      }
    );
  }

  // Go to RestaurantDetailsPage with Parameter as Reataurant Id
  onGoToRestaurant_detailsPage(restaurantID) {
    if (localStorage.getItem("cartItem") == null) {
      localStorage.setItem("rid", restaurantID);
      this.navCtrl.push("RestaurantDetailsPage", {
        id: restaurantID
      });
    } else {
      const tempRid = localStorage.getItem("rid");
      if (tempRid == restaurantID) {
        this.navCtrl.push("RestaurantDetailsPage", {
          id: restaurantID
        });
      } else {
        let alert = this.alertCtrl.create({
          title: "Are you sure?",
          message: "To change restaurant you have to clear your cart!",
          buttons: [
            {
              text: "Nope",
              role: "cancel",
              handler: () => {}
            },
            {
              text: "Sure",
              handler: () => {
                localStorage.removeItem("cartItem");

                localStorage.setItem("rid", restaurantID);
                this.navCtrl.push("RestaurantDetailsPage", {
                  id: restaurantID
                });
              }
            }
          ]
        });
        alert.present();
      }
    }
  }
}
