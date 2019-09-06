import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController
} from "ionic-angular";
import { PromotionalCodeService } from "./promotional-code.service";

@IonicPage()
@Component({
  selector: "page-promotional-code",
  templateUrl: "promotional-code.html",
  providers: [PromotionalCodeService]
})
export class PromotionalCodePage {
  private restaurantId: string;
  public promoCode: any = {
    couponName: "",
    offPrecentage: 0
  };
  public couponList: any[] = [];
  private deliveryInfo: any = {};
  private restaurantDetail: any = {};
  public isCouponApplied: boolean = false;
  public isFromSupportPage: boolean = false;
  constructor(
    private promoCodeService: PromotionalCodeService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    if (this.navParams.get("id") == undefined) {
      this.isFromSupportPage = false;
    } else {
      this.isFromSupportPage = this.navParams.get("id");
    }

    this.restaurantId = localStorage.getItem("rid");
    this.deliveryInfo = this.navParams.get("delivery");
    this.restaurantDetail = this.navParams.get("restaurant");
    this.getAllPromoCodes(this.restaurantId);
  }

  //Used for get all promocodes based on restaurant
  private getAllPromoCodes(id): void {
    let loader = this.loadingCtrl.create({ content: "Please wait..." });
    loader.present();

    this.promoCodeService.getPromoCodes(id).subscribe(
      (res: any) => {
        if (res.length > 0) {
          this.couponList = res;
        } else {
          this.showToaster("No Valid Coupons");
        }
        loader.dismiss();
      },
      error => {
        this.showToaster("Somthing Went Worng");
        loader.dismiss();
      }
    );
  }

  // used for selecting coupon data
  public onSelectCoupon(coupon): void {
    this.promoCode.couponName = coupon.couponName;
    this.promoCode.offPrecentage = coupon.offPrecentage;
    this.isCouponApplied = true;
  }

  // On appling coupon move to cart page
  public applyCoupon(): void {
    if (this.isFromSupportPage == false) {
      this.navCtrl.push("CartPage", {
        delivery: this.deliveryInfo,
        restaurant: this.restaurantDetail,
        promoCode: this.promoCode
      });
    } else {
      this.showToaster("You have to add item on cart First..!!!");
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
