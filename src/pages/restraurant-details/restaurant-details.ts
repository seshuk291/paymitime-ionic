import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController,
  Events,
  ActionSheetController
} from 'ionic-angular';
import { RestaurantDetailService } from './restaurant-detail.service';
import { ConstantService } from '../../app/constant.service';
import { map, tap } from 'rxjs/operators';
import { CartService } from '../../data-services/cart.service';

@IonicPage()
@Component({
  selector: 'page-restaurant-details',
  templateUrl: 'restaurant-details.html',
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

  public isQRMode: boolean;

  public restaurant: any = {};
  public contactPerson: any;
  public workingHours: any = {};
  public message: string = '';
  public isShopOpen: boolean = true;
  public isProductAvailable: boolean = false;
  public timeSchedule: any[] = [];
  public weekday: any[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  public location: any = {};
  // private restaurantDetail: any;
  public isPeak: boolean = false;
  public discountInfo: any = {
    minTime: 10,
    maxTime: 20,
    minDiscount: 10,
    maxDiscount: 30
  };

  cartQuantity = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public restService: RestaurantDetailService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private events: Events,
    private constantService: ConstantService,
    public actionSheetCtrl: ActionSheetController,
    private cartService: CartService
  ) {

    this.cartQuantity = this.cartService.cartState.quantity;

    // console.log("ITEM LIST", this.cartService.itemList);
    // this.setItems();
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

    // console.log("NAV PARAMS data", this.navParams.data);

    // console.log("NAV PARAMS", this.navParams);

    this.restaurantId = this.navParams.get('id');
    const mode = this.navParams.get('mode');

    if (mode === 'QR_SCAN') {
      this.isQRMode = true;
    }

    if (this.restaurantId != null) {
      this.getAllProduct(this.restaurantId);
    }
  }

  // Used for get all product list of that restaurant
  getAllProduct(id) {
    let loader = this.loadingCtrl.create({ content: 'Please wait...' });
    loader.present();

    this.restService
      .getRestaurantById(id)
      .pipe(
        tap(restaurant => {

          console.log("Calling set items");

          this.items = restaurant['items'];
          this.items.forEach(item => {
            item['quantity'] = 0;
          });

          this.setItems();

          this.restaurant = restaurant;
        })
      )
      .subscribe(
        (res: any) => {
          this.restaurant = res;
          console.log('RESTAURANT', this.restaurant);
          loader.dismiss();
        },
        error => {
          loader.dismiss();
        }
      );
  }


  setItems() {
    this.cartService.items$.subscribe((itemsInCart: Array<any>) => {
      // check if the items actually exists
      if (this.items && this.items.length > 0) {
        this.cartQuantity = 0;
        console.log("ITEMS", this.items);

        if(this.items.length > 0) {
          // reset quantity for all the items
          this.items.forEach(item => item.quantity = 0);
        }

        if (itemsInCart.length > 0) {
          console.log("ITEMS IN CART RESTAURANT PAGE", itemsInCart);
          // assign the quantity only the item is in the cart
          itemsInCart.forEach(itemInCart => {
            let itemToEdit = this.items.find(i => i.id === itemInCart.id);
            console.log("Item to edit", itemToEdit);
            itemToEdit['quantity'] = itemInCart.quantity;
            this.cartQuantity = this.cartQuantity + itemToEdit.quantity;
          });
        }
      }
      // console.log("CART QUANTITY", this.cartQuantity);
    });
  }

  updateQuantity(item, quantity) {
    console.log('QUANTITY TO EDIT', quantity);

    event.stopPropagation();

    // if there is no quantity property in item. assign a new property
    if (!item.quantity) {
      item['quantity'] = 0;
    }

    if (quantity == -1) {
      item.quantity--;
    } else if (quantity == 1) {
      item.quantity++;
    }

    if (item.quantity > 0) {
      this.cartService.updateQuantityOfItem(item.id, item.quantity);
    } else if (item.quantity === 0) {
      this.cartService.removeItem(item.id);
    }
  }

  removeItem(itemId) {
    this.cartService.removeItem(itemId);
  }

  // Used to goto product detail page
  addToCart(item) {

    let itemToAdd = {
      ...item,
      quantity: 1
    };

    this.cartService.addItem(itemToAdd);

    // let actionSheet = this.actionSheetCtrl.create({
    //   title: 'Modify your album',
    //   buttons: [
    //     {
    //       text: 'Destructive',
    //       role: 'destructive',
    //       handler: () => {
    //         console.log('Destructive clicked');
    //       }
    //     },
    //     {
    //       text: 'Archive',
    //       handler: () => {
    //         console.log('Archive clicked');
    //       }
    //     },
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       handler: () => {
    //         console.log('Cancel clicked');
    //       }
    //     }
    //   ]
    // });

    // actionSheet.present();

    // let restaurantInfo = {
    //   restaurantID: this.restaurantId,
    //   restaurantName: this.restaurant.restaurantName,
    //   location: this.location,
    //   taxInfo: this.restaurant.taxInfo
    // };
    // this.navCtrl.push("ProductDetailsPage", {
    //   product: item,
    //   restaurantName: this.restaurant.restaurantName,
    //   // delivery: this.deliveryInfo,
    //   restaurantData: restaurantInfo
    // });
  }
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
      'You can reach us by contacting us on ' + this.contactNumber
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
      title: 'Message',
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }

  // Event fire and listen in appcomponent
  goToCart() {
    // this.events.subscribe("restInfo", (res: any) => {
    //   this.deliveryInfo = res.delivery;
    //   this.restaurantDetail = res.restaurant;
    // });
    if (localStorage.getItem('cartItem') != null) {
      this.navCtrl.push('CartPage', {
        // delivery: this.deliveryInfo,
        restaurant: this.restaurantId
      });
    } else {
      this.navCtrl.push('CartPage');
    }
  }

  // updateSlider(e) {
  //   this.calculatedDiscount = this.discountInfo.minDiscount + (((this.discountInfo.maxDiscount - this.discountInfo.minDiscount)/(this.discountInfo.maxTime - this.discountInfo.minTime))*(this.pinValue - this.discountInfo.minTime));
  //   // console.log("Pin Value", this.pinValue);
  // }
}
