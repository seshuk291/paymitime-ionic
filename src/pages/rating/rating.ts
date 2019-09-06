import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController
} from "ionic-angular";
import { RatingService } from "./rating.service";

@IonicPage()
@Component({
  selector: "page-rating",
  templateUrl: "rating.html",
  providers: [RatingService]
})
export class RatingPage {
  review = {
    restaurantID: "",
    category: "",
    product: "",
    order: "",
    user: "",
    rating: "",
    comment: "",
    location: ""
  };

  public ratingInfo: any = {};
  itemId: "";
  index: "";
  orderId: "";
  reviews: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private ratingService: RatingService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    this.ratingInfo = this.navParams.get("ratingInfo");

    this.review.order = this.ratingInfo.orderId;
    this.review.restaurantID = this.ratingInfo.restaurantID;
    this.review.category = this.ratingInfo.categoryId;
    this.review.product = this.ratingInfo.product;
    this.review.user = this.ratingInfo.userId;
    this.review.location = this.ratingInfo.location;
  }

  //Used for submit rating and review
  onSubmit() {
    const loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.ratingService.submitReview(this.review).subscribe(
      (review: any) => {
        this.review.comment = "";
        this.createToaster("your response has been saved!", 3000);
        loader.dismiss();
        this.navCtrl.setRoot("HomePage");
      },
      error => {
        loader.dismiss();
      }
    );
  }

  //show toaster message
  private createToaster(message, duration) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration
    });
    toast.present();
  }
}
