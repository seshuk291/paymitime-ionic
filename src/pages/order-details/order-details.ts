import { OrdersService } from "./../orders/orders.service";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController
} from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-order-details",
  templateUrl: "order-details.html",
  providers: [OrdersService]
})
export class OrderDetailsPage {
  public orderDetail: any = {};
  public orderId: string;
  public ratingList: any[] = [];
  public showRating: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public orderService: OrdersService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.orderId = this.navParams.get("orderDetails");
    this.getOrderData(this.orderId);
  }

  // get orderdetail by order id
  getOrderData(id) {
    let loader = this.loadingCtrl.create({ content: "Please wait..." });
    loader.present();
    this.orderService.getOrderDataById(id).subscribe(
      (res: any) => {
        this.orderDetail = res;
        this.ratingList = res.productRating;
        if (this.ratingList.length == 0) {
          this.showRating = true;
        } else {
          this.showRating = false;
        }
        loader.dismiss();
      },
      error => {
        loader.dismiss();
        this.showToaster("Somthing Went Wrong");
      }
    );
  }

  // Go to rate page for ratting
  rateProduct(productId) {
    let ratingInfo: any = {};
    ratingInfo.orderId = this.orderDetail._id;
    ratingInfo.restaurantID = this.orderDetail.restaurantID;
    ratingInfo.categoryId = this.orderDetail.category;
    ratingInfo.product = productId;
    ratingInfo.location = this.orderDetail.location;
    ratingInfo.userId = this.orderDetail.user._id;
    this.navCtrl.push("RatingPage", {
      ratingInfo: ratingInfo
    });
  }

  // show toaster message
  showToaster(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
