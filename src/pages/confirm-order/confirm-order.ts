import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController
} from "ionic-angular";
import { AddressListService } from "./address-list.service";

@IonicPage()
@Component({
  selector: "page-confirm-order",
  templateUrl: "confirm-order.html",
  providers: [AddressListService]
})
export class ConfirmOrderPage {
  public paymentData: any = {};
  public addressList: any[] = [];
  public deliveryInfo: any = {};
  public orderData: any = {};
  public resturantDetail: any = {};
  public cart: any[] = [];
  public deliveryCharge: boolean = false;
  public isAllowToProceed: boolean = true; // if value is false then only we can go to next page(will allow to proceed)
  public loyalty: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public addressListService: AddressListService,
    public alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.cart = JSON.parse(localStorage.getItem("cartItem"));
    this.paymentData = this.navParams.get("makePayemt");
    this.deliveryInfo = this.navParams.get("delivery");
    console.log("Delivery Info", JSON.stringify(this.deliveryInfo));
    this.loyalty = this.navParams.get("loyalty");
    this.resturantDetail = this.navParams.get("restaurant");
    if (this.deliveryInfo.freeDelivery == false) {
      this.deliveryCharge = true;
      this.orderData.deliveryCharge = this.deliveryInfo.deliveryCharges;
    } else {
      this.deliveryCharge = false;
      this.orderData.deliveryCharge = "Free";
    }
  }

  //Used for get All User Address list for delivery
  getAllAddressList() {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.addressListService.getAddressList().subscribe(
      (res: any) => {
        this.addressList = res;
        loader.dismiss();
      },
      error => {
        loader.dismiss();
      }
    );
  }

  ionViewWillEnter() {
    this.getAllAddressList();
  }

  // Selecting a Delivery location and checking delivery is possible or not at this location
  selectAddress(address) {
    let arry = this.deliveryInfo.areaCode;
    console.log("Arry", JSON.stringify(this.deliveryInfo));
    if (this.deliveryInfo.areaAthority) {
      this.isAllowToProceed = false;
      this.orderData.shippingAddress = address;
    } else {
      let index = arry.findIndex(item => item.pinCode == address.zip);
      if (index == -1) {
        this.isAllowToProceed = true;
        let pins: string = "";
        if (arry.length > 0) {
          arry.forEach(pin => {
            pins = pins + pin.pinCode + ", ";
          });
          this.showAlert(
            "We don't deliver to this location. Please provide other address..! " +
            "Choose any one of the Pincode - " +
            pins +
            "from these as your delivery location"
          );
        } else {
          this.showAlert(
            "We don't deliver to this location. Please provide other address..!"
          );
        }
      } else {
        this.isAllowToProceed = false;
        this.orderData.shippingAddress = address;
      }
    }
  }

  // Show alert message if delivery is not present selected location(Zip Code)
  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: "Message",
      subTitle: message,
      buttons: ["Ok"]
    });
    alert.present();
  }

  // Used for go to payment page
  payment() {
    if (!this.isAllowToProceed) {
      this.orderData.restaurantID = this.resturantDetail.restaurantID;
      this.orderData.restaurantName = this.resturantDetail.restaurantName;
      this.orderData.location = this.resturantDetail.location._id;
      this.orderData.locationName = this.resturantDetail.location.locationName;
      this.orderData.grandTotal = this.paymentData.GrandTotal;
      this.orderData.subTotal = this.paymentData.subTotal;
      this.orderData.charges = this.resturantDetail.taxInfo.taxRate;
      this.orderData.productDetails = this.cart;
      this.orderData.status = "Pending";
      if (this.loyalty.isApplied == true) {
        this.orderData.loyalty = this.loyalty;
      }
      this.orderData.coupon = this.resturantDetail.coupon;
      this.orderData.payableAmount = this.paymentData.GrandTotal;
      this.orderData.orderType = "Home Delivery";
      this.navCtrl.push("PaymentPage", {
        order: this.orderData
      });
    } else {
      this.showAlert("Please select/provide your address first");
    }
  }

  // Used for go to AddAddressPage
  addAddress() {
    this.navCtrl.push("AddAddressPage");
  }

  // Used For deleting a Address from Address list
  deleteAddressData(index) {
    const loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.addressListService.deleteAddress(index).subscribe(
      res => {
        this.addressList.splice(index, 1);
        loader.dismiss();
      },
      error => {
        loader.dismiss();
      }
    );
  }
}
