import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController
} from "ionic-angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { RegisterService } from "./signup.service";

@IonicPage()
@Component({
  selector: "page-signup",
  templateUrl: "signup.html",
  providers: [RegisterService]
})
export class SignupPage implements OnInit {
  public remember: boolean;
  signUp: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public registerService: RegisterService,
    public toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.signUp = new FormGroup({
      name: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),
      contactNumber: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });
  }

  // Used for save signup credential
  onSignUp() {
    const loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    let user: any = {
      name: this.signUp.value.name,
      email: this.signUp.value.email,
      role: "User",
      contactNumber: parseInt(this.signUp.value.contactNumber),
      password: this.signUp.value.password
    };
    this.registerService.registerData(user).subscribe(
      (res: any) => {
        this.showToaster("Registaration successful!");
        loader.dismiss();
        this.navCtrl.setRoot("LoginPage");
      },
      error => {
        loader.dismiss();
        this.showToaster(error.error.message);
      }
    );
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
