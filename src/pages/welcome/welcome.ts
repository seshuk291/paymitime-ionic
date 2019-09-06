import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-welcome",
  templateUrl: "welcome.html"
})
export class WelcomePage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  nextSlideNav() {
    //   console.log("Hi i am there ");
  }

  goToHome() {
    this.navCtrl.setRoot("HomePage");
  }
  // used in Welcome Page
  display = [
    {
      img: "assets/imgs/wbg (2).jpg",
      title: "Welcome",
      describe: "Kitchen is proffesionally designed by Designer and Developer.",
      tagline: "Best suitable for your"
    },
    {
      img: "assets/imgs/wbg2.jpg",
      title: "Welcome",
      describe: "Kitchen is proffesionally designed by Designer and Developer.",
      tagline: "Best suitable for your"
    },
    {
      img: "assets/imgs/bg7.jpg",
      title: "Welcome",
      describe: "Kitchen is proffesionally designed by Designer and Developer.",
      tagline: "Best suitable for your"
    }
  ];
}
