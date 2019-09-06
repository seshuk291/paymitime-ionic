import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController
} from "ionic-angular";
import { AddressService } from "./address.service";

@IonicPage()
@Component({
  selector: "page-add-address",
  templateUrl: "add-address.html",
  providers: [AddressService]
})
export class AddAddressPage {
  public address: any = {
    name: "",
    city: "",
    zip: Number,
    locationName: "",
    contactNumber: Number,
    address: ""
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public addressService: AddressService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  //Submit Address Data
  onSubmitAddress() {
    if (this.address.zip < 999999 && this.address.zip > 99999) {
      const loader = this.loadingCtrl.create({
        content: "Please wait.."
      });
      loader.present();
      this.addressService.addAddress(this.address).subscribe(
        res => {
          loader.dismiss();
          this.navCtrl.pop();
        },
        error => {
          loader.dismiss();
        }
      );
    } else {
      this.showToaster("Please enter valid pincode!");
      this.address.zip = null;
    }
  }

  //Used to show Toaster
  showToaster(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}
