import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController
} from "ionic-angular";
import { FavouriteService } from "./favourites.service";

@IonicPage()
@Component({
  selector: "page-favourites",
  templateUrl: "favourites.html",
  providers: [FavouriteService]
})
export class FavouritesPage {
  public favouriteList: any[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public favService: FavouriteService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {}

  ionViewWillEnter() {
    this.getFavoritesList();
  }

  // Used for get All favorite list of user
  getFavoritesList() {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.favService.getUserFavouriteList().subscribe(
      (res: any) => {
        let rid = localStorage.getItem("rid");
        this.favouriteList = [];
        if (res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            if (rid == res[i].location._id) {
              this.favouriteList.push(res[i]);
            }
          }
        } else {
          this.showAlert("You don/'t have any favourit items");
        }
        console.log("Fav Res" + JSON.stringify(res));
        loader.dismiss();
      },
      error => {
        loader.dismiss();
      }
    );
  }

  // Selecting favorite item its goes to product detail page
  onSelectfavourit(item) {
    let restaurantInfo = {
      restaurantID: item.restaurantID._id,
      restaurantName: item.restaurantID.restaurantName,
      location: item.location._id,
      locationName: item.location.locationName,
      taxInfo: item.restaurantID.taxInfo
    };
    if (item.location.deliveryInfo != undefined) {
      this.navCtrl.push("ProductDetailsPage", {
        product: item.product,
        restaurantName: item.restaurantID.restaurantName,
        delivery: item.location.deliveryInfo.deliveryInfo,
        restaurantData: restaurantInfo
      });
    } else {
      this.showAlert("Right now you can not enter into this prodcut");
    }
  }

  // Used for delete from favorite list of user
  onClickDelete(item) {
    console.log("item--", item);
    const loader = this.loadingCtrl.create({
      content: "Please wait"
    });
    loader.present();
    this.favService.removeFavourite(item).subscribe(
      (res: any) => {
        loader.dismiss();
        this.getFavoritesList();
      },
      error => {
        loader.dismiss();
      }
    );
  }

  //Used for show alert message
  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: "Message",
      subTitle: message,
      buttons: ["Ok"]
    });
    alert.present();
  }
}
