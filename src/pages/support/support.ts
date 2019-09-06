import { Component } from "@angular/core";
import { IonicPage, NavController, AlertController } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-support",
  templateUrl: "support.html"
})
export class SupportPage {
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController
  ) {}

  //Used to go Order Page
  orders() {
    if (localStorage.getItem("token") != null) {
      this.navCtrl.push("OrdersPage");
    } else {
      let alert = this.alertCtrl.create({
        title: "Please!",
        subTitle: "Login First..!",
        buttons: ["OK"]
      });
      alert.present();
    }
  }
  // Used to go PromotionalCodePage if token is valid
  promotions() {
    if (localStorage.getItem("token") != null) {
      this.navCtrl.push("PromotionalCodePage", {
        id: true
      });
    } else {
      let alert = this.alertCtrl.create({
        title: "Please!",
        subTitle: "Login First..!",
        buttons: ["OK"]
      });
      alert.present();
    }
  }
}
