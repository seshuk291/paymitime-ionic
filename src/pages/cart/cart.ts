import { Component } from "@angular/core";
// import { AlertController } from '@ionic/angular';
// import { BackgroundMode } from '@ionic-native/background-mode';


import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  Events,
  LoadingController,
  AlertController
} from "ionic-angular";
import { ProfileService } from "./../profile/profile.service";
import { CartService } from "./cart.service";
import { timer, Subscription } from 'rxjs';


@IonicPage()
@Component({
  selector: "page-cart",
  templateUrl: "cart.html",
  providers: [ProfileService, CartService]
})
export class CartPage {
  public cart: any[] = [];
  public GrandTotal: any;
  public subTotal: any;
  public restaurant: any;
  public deliveryInfo: any = {};
  public restaurantDetail: any = {};
  public promoCode: any = {};
  public isCouponApplied: boolean = false;
  public loyalty: any = {};
  public loyaltyArray: any[] = [];
  public loyaltyPoints: number = 0;
  public loyaltyAppliedData: boolean = false;
  public loyaltyData: any = {
    isApplied: false,
    loyaltyPoints: 0
  };
  public loyaltyTest: boolean = false;
  public isLogin: boolean = false;
  public timerStopped: boolean = false;
  private ticks: number = 0;
  private minutesDisplay: number = 0;
  private hoursDisplay: number = 0;
  private secondsDisplay: number = 0;
  public sub: Subscription;
  public timerStarted: boolean = false;
  public displayDiscount: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private profileService: ProfileService,
    private toastCtrl: ToastController,
    private cartService: CartService,
    public events: Events,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    // public backgroundMode : BackgroundMode
  ) {
    console.log(localStorage.getItem("cartItem"));
    this.cart = JSON.parse(localStorage.getItem("cartItem"));
    if (
      this.navParams.get("delivery") != null &&
      this.navParams.get("restaurant") != null
    ) {
      this.deliveryInfo = this.navParams.get("delivery");
      this.restaurantDetail = this.navParams.get("restaurant");
    }
    if (this.navParams.get("promoCode") != null) {
      this.isCouponApplied = true;
      this.promoCode = this.navParams.get("promoCode");
      this.restaurantDetail.coupon = {
        couponApplied: true,
        offPrecentage: this.promoCode.offPrecentage.offPrecentage,
        couponName: this.promoCode.couponName
      };
    } else {
      this.isCouponApplied = false;
      this.restaurantDetail.coupon = { couponApplied: false };
    }
    if (this.cart != null) {
      this.restaurant = this.cart[0].restaurant;
      this.calculateAmount();
      if (localStorage.getItem("token") != null) {
        this.isLogin = true;
        this.getLoyaltyPoints(this.restaurantDetail.restaurantID);
      }
    }
  }

  //Used for get User Loyality Pints
  getLoyaltyPoints(restId) {
    if (restId != null) {
      const loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();
      this.cartService.getUserLoyaltyPoints(restId).subscribe(
        (res: any) => {
          if (res.length > 0) {
            this.loyalty.loyaltyProgram = res[0].loyalityProgram;
            this.loyalty.minLoyaltyPoints = res[0].minLoyalityPoints;
          }
          if (this.loyalty.loyaltyProgram == true) {
            this.profileService.getUserDetails().subscribe(
              (res: any) => {
                this.loyaltyArray = res.loyaltyPoints;
                for (let i = 0; i < this.loyaltyArray.length; i++) {
                  this.loyaltyPoints =
                    this.loyaltyPoints + this.loyaltyArray[i].point;
                }
                if (this.loyalty.minLoyaltyPoints <= this.loyaltyPoints) {
                  this.loyaltyAppliedData = true;
                  this.loyaltyTest = true;
                }
                loader.dismiss();
              },
              error => {
                loader.dismiss();
              }
            );
          } else {
            loader.dismiss();
          }
        },
        error => {
          loader.dismiss();
        }
      );
    }
  }

  // Used for Decrease number of quantity
  removeQuantity(i) {
    if (this.cart[i].Quantity > 1) {
      this.cart[i].Quantity = this.cart[i].Quantity - 1;
      this.calculateAmount();
    }
  }

  // Used for Increase number of quantity
  addQuantity(i) {
    this.cart[i].Quantity = this.cart[i].Quantity + 1;
    this.calculateAmount();
  }

  // Used for Delete item from cart List items
  deleteItem(i) {
    this.cart.splice(i, 1);
    this.calculateAmount();
    localStorage.setItem("cartItem", JSON.stringify(this.cart));
    if (this.cart.length == 0) {
      this.GrandTotal = 0;
      localStorage.removeItem("cartItem");
    }
  }

  // Used for calculation SubTotal, GrandTotal
  calculateAmount() {
    let TotalPrice = 0;
    for (let i = 0; i < this.cart.length; i++) {
      TotalPrice = TotalPrice + this.cart[i].totalPrice * this.cart[i].Quantity;
    }
    this.subTotal = TotalPrice;
    if (this.isCouponApplied) {
      TotalPrice = TotalPrice - TotalPrice * this.promoCode.offPrecentage / 100;
    }
    let texRate = 0;
    if (this.restaurantDetail.taxInfo != undefined) {
      texRate = this.restaurantDetail.taxInfo.taxRate;
    }
    this.GrandTotal = TotalPrice + TotalPrice * texRate / 100;

    if (
      this.subTotal < this.deliveryInfo.amountEligibility &&
      this.deliveryInfo.freeDelivery == false
    ) {
      this.GrandTotal =
        this.GrandTotal + Number(this.deliveryInfo.deliveryCharges);
    }
  }

  //Used For on Apply Loyality Points
  onApplyLoyaltyPoints() {
    if (this.loyaltyAppliedData == true) {
      this.loyaltyAppliedData = false;
      this.GrandTotal = this.GrandTotal - this.loyaltyPoints;
      this.loyaltyData.isApplied = true;
      this.loyaltyData.loyaltyPoints = this.loyaltyPoints;
    } else if (this.loyaltyData.isApplied) {
      this.loyaltyAppliedData = true;
      this.loyaltyData.isApplied = false;
      this.GrandTotal = this.GrandTotal + this.loyaltyPoints;
    } else {
      this.showToaster("You Cannot Apply");
    }
  }

  //Used for Place the Order and start the time
  placeOrder() {
    let alert = this.alertCtrl.create({
      title: 'Best Food',
      message: 'Press Ok to place your order.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: () => {
            this.timerStarted = true;
            localStorage.setItem("orderPlaced", "true");
            var date = new Date();
            localStorage.setItem("orderDateTime", date.toString());
            this.startTimer();
          }
        }
      ]
    })
    alert.present();
    // this.timerStarted = true;
    // this.startTimer();
  }

  readyToCheckout() {
    let alert = this.alertCtrl.create({
      title: 'Ready!',
      message: 'Are you sure you want to checkout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Sure',
          handler: () => {
            this.timerStopped = true;
            this.displayDiscount = true;
            // this.backgroundMode.disable();
            localStorage.setItem("orderPlaced", "false");
            localStorage.removeItem("orderDateTime");
            this.sub.unsubscribe();
          }
        }
      ]
    })
    alert.present();
    // this.timerStopped = true;
  }

  // Used For Confirmation of order
  confirmOrder() {
    if (localStorage.getItem("token") != null) {
      const loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();
      this.profileService.getUserDetails().subscribe(
        (res: any) => {
          // console.log("token my console", res);
          if (res != undefined) {
            let payment = {
              subTotal: this.subTotal,
              GrandTotal: this.GrandTotal,
              restaurant: this.restaurant
            };
            loader.dismiss();
            this.navCtrl.push("ConfirmOrderPage", {
              makePayemt: payment,
              delivery: this.deliveryInfo,
              restaurant: this.restaurantDetail,
              loyalty: this.loyaltyData
            });
          } else {
            loader.dismiss();
            this.showToaster("You are not authorized please try re-login");
          }
        },
        error => {
          loader.dismiss();
          this.showToaster(error.message);
        }
      );
    } else {
      this.showToaster("Please login first to proceed!");
    }
  }

  // Used for Apply PromoCode
  onPromoCodeApply() {
    this.navCtrl.push("PromotionalCodePage", {
      delivery: this.deliveryInfo,
      restaurant: this.restaurantDetail
    });
  }

  //Used for Show Toaster
  showToaster(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  showTimer() {

  }

  startTimer() {
        // this.backgroundMode.enable();
        // this.backgroundMode.on("activate").subscribe(() => {

          const time = timer(1, 1000);
          this.sub = time.subscribe(
            t => {
              this.ticks = t;

              this.secondsDisplay = this.getSeconds(this.ticks);
              this.minutesDisplay = this.getMinutes(this.ticks);
              this.hoursDisplay = this.getHours(this.ticks);
            }
          );
        // })
    }

    private getSeconds(ticks: number) {
        return this.pad(ticks % 60);
    }

    private getMinutes(ticks: number) {
         return this.pad((Math.floor(ticks / 60)) % 60);
    }

    private getHours(ticks: number) {
        return this.pad(Math.floor((ticks / 60) / 60));
    }

    private pad(digit: any) {
        return digit <= 9 ? '0' + digit : digit;
    }

    editCart() {

      console.log(localStorage.getItem("orderPlaced"));
      console.log(localStorage.getItem("orderDateTime"));
      this.navCtrl.push("RestaurantDetailsPage", {
        id: localStorage.getItem("rid")
      });
    }
}
