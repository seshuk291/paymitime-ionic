import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-landin",
  templateUrl: "landin.html"
})
export class LandinPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  facebookLogin() {}

  googleLogin() {}

  twitterLogin() {}

  OnGoToLogin() {
    this.navCtrl.setRoot("LoginPage");
  }
  OnGoToSignUp() {
    this.navCtrl.setRoot("SignupPage");
  }
}
