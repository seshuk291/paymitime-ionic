import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-add-card",
  templateUrl: "add-card.html"
})
export class AddCardPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  deliveryAddress() {
    this.navCtrl.push("DeliveryAddressPage");
  }
}
