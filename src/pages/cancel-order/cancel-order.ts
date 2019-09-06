import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from "ionic-angular";
import { CancelService } from "./cancel.service";

@IonicPage()
@Component({
  selector: "page-cancel-order",
  templateUrl: "cancel-order.html",
  providers: [CancelService]
})
export class CancelOrderPage {
  public orderId: any;
  public dateData: any;
  public orderDataID: any;
  public isCancled: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public cancelService: CancelService,
    public loadingCtrl: LoadingController
  ) {
    this.orderId = this.navParams.get("orderId");
    this.orderDataID = this.navParams.get("orderDataID");
    this.cancelOrder(this.orderId);
  }

  // Used for Update Order Status Cancel
  cancelOrder(orderId) {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.cancelService.updateOrderStatus(orderId).subscribe(
      (res: any) => {
        this.dateData = Date.now();
        this.isCancled = true;
        loader.dismiss();
      },
      error => {
        loader.dismiss();
      }
    );
  }

  // Go To HomePage
  OnClick() {
    this.navCtrl.setRoot("HomePage");
  }
}
