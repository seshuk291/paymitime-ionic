import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ToastController,
  LoadingController
} from "ionic-angular";
import { ForgetPasswordService } from "./forget-password.service";

@IonicPage()
@Component({
  selector: "page-forget-password",
  templateUrl: "forget-password.html",
  providers: [ForgetPasswordService]
})
export class ForgetPasswordPage {
  public email: string;
  constructor(
    private fpService: ForgetPasswordService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  // Used for send OTP to email id
  onClickSubmit() {
    if (this.email.length > 3) {
      const loader = this.loadingCtrl.create({
        content: "Please wait.."
      });
      loader.present();
      this.fpService.forgetPassword(this.email).subscribe(
        (res: any) => {
          loader.dismiss();
          this.navCtrl.push("OtpPage", { token: res.token });
        },
        error => {
          this.showToaster(error.error.message);
          loader.dismiss();
        }
      );
    } else {
      this.showToaster("Please provide valid email!");
    }
  }

  //Used for show  toaster message
  showToaster(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  onClickSignup() {
    this.navCtrl.setRoot("SignupPage");
  }
  onClickLogin() {
    this.navCtrl.setRoot("LoginPage");
  }
}
