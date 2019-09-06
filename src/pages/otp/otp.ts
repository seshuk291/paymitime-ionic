import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ToastController,
  NavParams,
  LoadingController
} from "ionic-angular";
import { OtpService } from "./otp.service";

@IonicPage()
@Component({
  selector: "page-otp",
  templateUrl: "otp.html",
  providers: [OtpService]
})
export class OtpPage {
  public otp: string;
  private token: string;
  constructor(
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private otpService: OtpService,
    private navParams: NavParams,
    private loadingCtrl: LoadingController
  ) {
    this.token = this.navParams.get("token");
  }

  // send OTP of 6 digit to server for password change
  onClickSubmit() {
    if (this.otp.length == 6) {
      const loader = this.loadingCtrl.create({
        content: "Please wait"
      });
      loader.present();
      this.otpService.sendOtp(this.otp, this.token).subscribe(
        res => {
          this.showToaster("Your Otp has been verified!");
          loader.dismiss();
          this.navCtrl.setRoot("NewPasswordPage", { token: this.token });
        },
        error => {
          loader.dismiss();
          this.showToaster(error.error.message);
        }
      );
    } else {
      this.showToaster("Wrong OTP. Please try again.!");
    }
  }

  onClickSignup() {
    this.navCtrl.setRoot("SignupPage");
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
