import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ToastController,
  Events,
  LoadingController
} from "ionic-angular";
import { ProductDetailService } from "./product-details.service";

@IonicPage()
@Component({
  selector: "page-product-details",
  templateUrl: "product-details.html",
  providers: [ProductDetailService]
})
export class ProductDetailsPage {
  public productData: any = {};
  public selectedPrice: number = 0;
  public varientSizePrice: any[] = [];
  public productCount: number = 1;
  public Cart: any[] = [];
  public productDetail: any = {
    totalPrice: Number
  };
  public itemInCart: any[] = [];
  public sizeSelected: boolean = false;
  public restaurant: any;
  public deliveryInfo: any = {};
  public restaurantDetail: any = {};
  public Itemfavourite: any;
  public visible = true;
  public index: any;
  public extraIngredients: Array<{}>;
  private selectedIngredients = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public productDetailService: ProductDetailService,
    public events: Events
  ) {
    console.log(JSON.stringify(this.navParams));
    this.productData = this.navParams.get("product");
    // this.extraIngredients = this.productData.extraIngredients;
    this.restaurant = this.navParams.get("restaurantName");
    this.deliveryInfo = this.navParams.get("delivery");
    this.restaurantDetail = this.navParams.get("restaurantData");
    if (localStorage.getItem("token") != null) {
      this.checkFavourite();
    }
  }

  // Used for check product is favorite or not
  checkFavourite() {
    const loader = this.loadingCtrl.create({
      content: "Please wait"
    });
    loader.present();
    this.productDetailService.checkFavourite(this.productData._id).subscribe(
      (res: any) => {
        if (res.resflag == false) {
          this.visible = true;
        } else {
          this.Itemfavourite = res._id;
          this.visible = false;
        }
        loader.dismiss();
      },
      error => {
        loader.dismiss();
      }
    );
  }

  // used for selecting size and price of product
  sizeOptions(price, i) {
    this.selectedPrice = price;
    this.sizeSelected = !this.sizeSelected;
    this.productData.totalPrice = price;
    this.index = i;
  }

  //to add extra ingredients
  onChangeExtra(event, extra) {
    if (event.checked) {
      this.selectedIngredients.push(extra);
    } else {
      if(this.selectedIngredients.length>0){
        for(let i=0; i<this.selectedIngredients.length; i++){
         if(extra.name==this.selectedIngredients[i].name){
           this.selectedIngredients.splice(i,1);
         }
        }
      }
    }
  }

  // Used for Recduce quantity
  reduceQuantity() {
    if (this.productCount > 1) {
      this.productCount = this.productCount - 1;
    }
  }

  // Used for increase quantity
  increaseQuantity() {
    if (this.productCount < 10) {
      this.productCount = this.productCount + 1;
    }
  }

  // Used for add to cart item
  addToCart(productId) {
    if (this.sizeSelected == false) {
      let alert = this.alertCtrl.create({
        title: "Please!",
        subTitle: "Select Size and prize..!",
        buttons: ["OK"]
      });
      alert.present();
    } else {
      this.Cart = JSON.parse(localStorage.getItem("cartItem"));
      if (this.Cart == null) {
        this.productDetail.restaurant = this.restaurant;
        this.productDetail.title = this.productData.title;
        this.productDetail.brand = this.productData.brand;
        this.productDetail.productId = this.productData._id;
        this.productDetail.Quantity = this.productCount;
        this.productDetail.imageUrl = this.productData.imageUrl;
        this.productDetail.restaurantID = this.productData.restaurantID;
        this.productDetail.location = this.productData.location;
        if (this.selectedIngredients != undefined && this.selectedIngredients.length > 0) {
          this.productDetail.extraIngredients = [];
          let tempTotalPrice = 0;
          this.selectedIngredients.forEach(item => {
            this.productDetail.extraIngredients.push(item);
            tempTotalPrice = tempTotalPrice + Number(item.price);
          });
          this.productDetail.totalPrice = Number(this.productData.totalPrice) + tempTotalPrice;
        } else {
          this.productDetail.totalPrice = this.productData.totalPrice;
        }
        this.productDetail.weight = this.productData.variants[
          this.index
        ].weight;
        this.productDetail.MRP = this.productData.variants[this.index].MRP;
        this.productDetail.Discount = this.productData.variants[
          this.index
        ].Discount;
        this.productDetail.price = this.productData.variants[this.index].price;
        this.itemInCart.push(this.productDetail);
        localStorage.setItem("cartItem", JSON.stringify(this.itemInCart));
      } else {
        let index = this.Cart.findIndex(
          item =>
            item.productId == this.productData._id &&
            item.weight == this.productData.variants[this.index].weight
        );
        if (index >= 0) {
          this.Cart.splice(index, 1);
          this.productDetail.restaurant = this.restaurant;
          this.productDetail.title = this.productData.title;
          this.productDetail.brand = this.productData.brand;
          this.productDetail.productId = this.productData._id;
          this.productDetail.Quantity = this.productCount;
          this.productDetail.imageUrl = this.productData.imageUrl;
          this.productDetail.restaurantID = this.productData.restaurantID;
          this.productDetail.location = this.productData.location;
          if (this.selectedIngredients != undefined && this.selectedIngredients.length > 0) {
            this.productDetail.extraIngredients = [];
            let tempTotalPrice = 0;
            this.selectedIngredients.forEach(item => {
              this.productDetail.extraIngredients.push(item);
              tempTotalPrice = tempTotalPrice + Number(item.price);
            });
            this.productDetail.totalPrice = Number(this.productData.totalPrice) + tempTotalPrice;
          } else {
            this.productDetail.totalPrice = this.productData.totalPrice;
          }
          this.productDetail.weight = this.productData.variants[
            this.index
          ].weight;
          this.productDetail.MRP = this.productData.variants[this.index].MRP;
          this.productDetail.Discount = this.productData.variants[
            this.index
          ].Discount;
          this.productDetail.price = this.productData.variants[
            this.index
          ].price;
          this.Cart.push(this.productDetail);
          localStorage.setItem("cartItem", JSON.stringify(this.Cart));
        } else {
          this.productDetail.restaurant = this.restaurant;
          this.productDetail.title = this.productData.title;
          this.productDetail.brand = this.productData.brand;
          this.productDetail.productId = this.productData._id;
          this.productDetail.Quantity = this.productCount;
          this.productDetail.imageUrl = this.productData.imageUrl;
          this.productDetail.restaurantID = this.productData.restaurantID;
          this.productDetail.location = this.productData.location;
          if (this.selectedIngredients != undefined && this.selectedIngredients.length > 0) {
            this.productDetail.extraIngredients = [];
            let tempTotalPrice = 0;
            this.selectedIngredients.forEach(item => {
              this.productDetail.extraIngredients.push(item);
              tempTotalPrice = tempTotalPrice + Number(item.price);
            });
            this.productDetail.totalPrice = Number(this.productData.totalPrice) + tempTotalPrice;
          } else {
            this.productDetail.totalPrice = this.productData.totalPrice;
          }
          this.productDetail.weight = this.productData.variants[
            this.index
          ].weight;
          this.productDetail.MRP = this.productData.variants[this.index].MRP;
          this.productDetail.Discount = this.productData.variants[
            this.index
          ].Discount;
          this.productDetail.price = this.productData.variants[
            this.index
          ].price;
          this.Cart.push(this.productDetail);
          localStorage.setItem("cartItem", JSON.stringify(this.Cart));
        }
      }
      let tempObj = {
        delivery: this.deliveryInfo,
        restaurant: this.restaurantDetail
      };
      this.events.publish("restInfo", tempObj);
      this.showToaster("Item has been added to cart");
      this.navCtrl.pop();
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

  // Toggle product option favorite or not
  // toggle() {
  //   if (localStorage.getItem("token") != null) {
  //     this.visible = !this.visible;
  //     if (this.visible == false) {
  //       const loader = this.loadingCtrl.create({
  //         content: "Please wait"
  //       });
  //       loader.present();
  //       this.productDetailService
  //         .addFavourite(
  //           this.productData._id,
  //           this.restaurantDetail.restaurantID,
  //           this.restaurantDetail.location
  //         )
  //         .subscribe(
  //           (res: any) => {
  //             this.Itemfavourite = res._id;

  //             loader.dismiss();
  //           },
  //           error => {
  //             this.showToaster(error.error.message);
  //             this.visible = !this.visible;
  //             loader.dismiss();
  //           }
  //         );
  //     } else {
  //       const loader = this.loadingCtrl.create({
  //         content: "Please wait"
  //       });
  //       loader.present();
  //       this.productDetailService.removeFavourite(this.Itemfavourite).subscribe(
  //         (res: any) => {
  //           loader.dismiss();
  //         },
  //         error => {
  //           this.showToaster(error.error.message);
  //           this.visible = !this.visible;
  //           loader.dismiss();
  //         }
  //       );
  //     }
  //   } else {
  //     this.showToaster("Please login first to add to favourite");
  //   }
  // }
}
