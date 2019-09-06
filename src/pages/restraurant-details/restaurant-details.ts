import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController,
  Events
} from "ionic-angular";
import { RestaurantDetailService } from "./restaurant-detail.service";
import { ConstantService } from '../../app/constant.service';
import { map, tap } from 'rxjs/operators';

@IonicPage()
@Component({
  selector: "page-restaurant-details",
  templateUrl: "restaurant-details.html",
  providers: [RestaurantDetailService]
})
export class RestaurantDetailsPage {


  apiUrl = this.constantService.testApi;


  public pinValue: number = 0;
  public calculatedDiscount: number = 0;
  searchBoxVisible = false;
  btnsVisible = true;
  visible = false;
  public cartItemCount: number = 0;
  public contactNumber: number;
  public noOfProduct: number = 0;
  public restaurantId: any;
  public rating: number = 0;


  public items: any[] = [];
  public itemCategories = [];

  public restaurant: any = {};
  public contactPerson: any;
  public workingHours: any = {};
  public message: string = "";
  public isShopOpen: boolean = true;
  public isProductAvailable: boolean = false;
  public timeSchedule: any[] = [];
  public weekday: any[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  public location: any = {};
  // private restaurantDetail: any;
  public isPeak: boolean = false;
  public discountInfo: any = {
    "minTime": 10,
    "maxTime": 20,
    "minDiscount": 10,
    "maxDiscount": 30
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public restService: RestaurantDetailService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private events: Events,
    private constantService: ConstantService
  ) {

  }

  ionViewWillEnter() {
    // this.events.subscribe("restInfo", (res: any) => {
    //   console.log("[EVENT RES]", res);
    // });
    // if (localStorage.getItem("cartItem") != null) {
    //   this.cartItemCount = JSON.parse(localStorage.getItem("cartItem")).length;
    // }
  }

  async ionViewWillLoad() {

    // this.restService.getAllItemsByRestaurantId(this.restaurantId)
    // .subscribe(items => {
    //     console.log("[Items]", items);
    // });

    this.restaurantId = this.navParams.get("id");
    console.log("[REstaurant page] RESTAURANT ID", this.restaurantId);
    if (this.restaurantId != null) {
      this.getAllProduct(this.restaurantId);
    }
  }

  // Used for get all product list of that restaurant
  getAllProduct(id) {
    let loader = this.loadingCtrl.create({content: "Please wait..."});
    loader.present();

    this.restService.getRestaurantById(id)
    .pipe(
      tap(restaurant => {
        this.items = restaurant['items'];
        this.restaurant = restaurant;
      })
    )
    .subscribe((res: any) => {
        this.restaurant = res;
        console.log("RESTAURANT", this.restaurant);
        loader.dismiss();
      },
      error => {
        loader.dismiss();
      }
    );
  }

  // Used to goto product detail page
  // OnGoToProduct_detailsPage(item) {
  //   let restaurantInfo = {
  //     restaurantID: this.restaurant._id,
  //     restaurantName: this.restaurant.restaurantName,
  //     location: this.location,
  //     taxInfo: this.restaurant.taxInfo
  //   };
  //   this.navCtrl.push("ProductDetailsPage", {
  //     product: item,
  //     restaurantName: this.restaurant.restaurantName,
  //     delivery: this.deliveryInfo,
  //     restaurantData: restaurantInfo
  //   });
  // }
  searchVisible() {
    this.searchBoxVisible = true;
    this.btnsVisible = false;
  }
  btnVisible() {
    this.searchBoxVisible = false;
    this.btnsVisible = true;
  }

  favToggle() {
    this.visible = !this.visible;
  }

  onClickInfo() {
    this.showAlert(
      "You can reach us by contacting us on " + this.contactNumber
    );
  }

  // // Go To chat with restaurant
  // gotoChat() {
  //   if (localStorage.getItem("token") != null) {
  //     const loader = this.loadingCtrl.create({
  //       content: "Please wait..."
  //     });
  //     loader.present();
  //     this.restService.checkValidToken().subscribe(
  //       (res: any) => {
  //         if (res) {
  //           this.navCtrl.push("ChatPage", {
  //             managerId: this.contactPerson,
  //             restId: this.restaurantId
  //           });
  //         }
  //         loader.dismiss();
  //       },
  //       error => {
  //         loader.dismiss();
  //         this.showAlert(
  //           "You are not authorized. Please login again to send messages"
  //         );
  //       }
  //     );
  //   } else {
  //     this.showAlert("Please login first to start chat!");
  //   }
  // }

  // show alert message
  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: "Message",
      subTitle: message,
      buttons: ["Ok"]
    });
    alert.present();
  }

  // // Event fire and listen in appcomponent
  // goToCart() {
  //   this.events.subscribe("restInfo", (res: any) => {
  //     this.deliveryInfo = res.delivery;
  //     this.restaurantDetail = res.restaurant;
  //   });
  //   if (localStorage.getItem("cartItem") != null) {
  //     this.navCtrl.push("CartPage", {
  //       delivery: this.deliveryInfo,
  //       restaurant: this.restaurantDetail
  //     });
  //   } else {
  //     this.navCtrl.push("CartPage");
  //   }
  // }

  // updateSlider(e) {
  //   this.calculatedDiscount = this.discountInfo.minDiscount + (((this.discountInfo.maxDiscount - this.discountInfo.minDiscount)/(this.discountInfo.maxTime - this.discountInfo.minTime))*(this.pinValue - this.discountInfo.minTime));
  //   // console.log("Pin Value", this.pinValue);
  // }
}
