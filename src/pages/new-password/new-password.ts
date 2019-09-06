import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController
} from "ionic-angular";
import { NewPasswordService } from "./new-password.service";

@IonicPage()
@Component({
  selector: "page-new-password",
  templateUrl: "new-password.html",
  providers: [NewPasswordService]
})
export class NewPasswordPage {
  public newPassword: string;
  public confirmPassword: string;
  private token: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private npService: NewPasswordService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    this.token = this.navParams.get("token");
  }

  //send password of greater than 5
  onClickChangePassword() {
    if (this.newPassword.length > 5) {
      if (this.newPassword != this.confirmPassword) {
        this.showToaster("Confirm password does not match.!");
      } else {
        const loader = this.loadingCtrl.create({
          content: "Please wait"
        });
        loader.present();
        this.npService.setNewPassword(this.newPassword, this.token).subscribe(
          res => {
            this.showToaster("Your password has been changed!");
            loader.dismiss();
            this.navCtrl.setRoot("LoginPage");
          },
          error => {
            loader.dismiss();
            this.showToaster(error.error.message);
          }
        );
      }
    } else {
      this.showToaster("New Password should be six character long.!");
    }
  }

  // show toaster message
  showToaster(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}
