import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-track-order",
  templateUrl: "track-order.html"
})
export class TrackOrderPage {
  public pendingOrder: any = {};
  public notification: any[] = [
    {
      status: "Order Placed",
      img: ""
    }
  ];

  // this array used in view page as img in track order
  public particulars = [
    {
      img: "assets/imgs/order-placed.png"
    },
    {
      img: "assets/imgs/order-confirmed.png"
    },
    {
      img: "assets/imgs/order-processed.png"
    },
    {
      img: "assets/imgs/order-delivered.png"
    }
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pendingOrder = this.navParams.get("order");

    this.notification[0].time = this.pendingOrder.userNotification[0].time;
    this.notification.push(...this.pendingOrder.userNotification);
    for (let i = 0; i < this.notification.length; i++) {
      this.notification[i].img = this.particulars[i].img;
    }
  }

  // Used for cancel order
  trackOrder() {
    if (this.pendingOrder.status != "Delivered") {
      this.navCtrl.setRoot("CancelOrderPage", {
        orderId: this.pendingOrder._id,
        orderDataID: this.pendingOrder.orderID
      });
    }
  }
}
