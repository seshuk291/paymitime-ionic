import { Component } from '@angular/core';

import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  Events,
  LoadingController,
  AlertController
} from 'ionic-angular';
import { ProfileService } from './../profile/profile.service';

import { CartService } from '../../data-services/cart.service';
import { ConstantService } from '../../app/constant.service';
import { HttpClient } from '@angular/common/http';
import { OrdersService } from '../orders/orders.service';

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
  providers: [ProfileService, OrdersService]
})
export class CartPage {
  // public cart: any[] = [];
  public grandTotal: any;
  public total: any;
  public restaurant: any;
  public deliveryInfo: any = {};
  public restaurantDetail: any = {};
  // public promoCode: any = {};
  public isCouponApplied: boolean = false;
  restaurantId;
  coupon: any;
  coupon_discount_amount: number;
  itemsInCart;
  apiUrl = this.constantService.testApi;
  user;

  constructor(
    public  navCtrl: NavController,
    public  navParams: NavParams,
    private profileService: ProfileService,
    private toastCtrl: ToastController,
    private cartService: CartService,
    public  events: Events,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private constantService: ConstantService,
    private httpClient: HttpClient,
    private orderService: OrdersService
  ) // public backgroundMode : BackgroundMode
  {
    // console.log("CART STATE", this.cartService.cartState);

    this.profileService.getUserDetails().subscribe(user => {
      console.log("User", user);
      this.user = user;
    });


    // add items from the state
    this.cartService.items$.subscribe(items => {

      if(items && items.length > 0) {
        this.restaurantId = items[0].restaurant;
      }

      this.itemsInCart = items;
      this.grandTotal = 0;
      this.total = 0;
      this.itemsInCart.forEach(item => {
        this.total = this.total + item.quantity * item.price;
      });
      this.grandTotal = this.total;
      console.log('ITEMS IN CART', this.itemsInCart);
    });
  }

  getItemById(id) {
    return this.httpClient.get(this.apiUrl + 'items/' + id);
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
          handler: () => {}
        }
      ]
    });
    alert.present();
    // this.timerStopped = true;
  }

  // Used For Confirmation of order
  confirmOrder() {}

  // Used for Apply PromoCode
  onPromoCodeApply() {
    this.navCtrl.push('PromotionalCodePage', {
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

  updateQuantity(item, quantity) {
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
    let alert = this.alertCtrl.create({
      title: 'Delete',
      message: 'Are you sure you want to remove the item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Remove',
          handler: () => {
            this.cartService.removeItem(itemId);
          }
        }
      ]
    });
    alert.present();
  }

  placeOrder() {
    let alert = this.alertCtrl.create({
      title: 'Place order',
      message: 'Are you sure you want to place the order',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.createOrder();
          }
        }
      ]
    });
    alert.present();
  }

  createOrder() {


    if(this.user) {
      const quantity = this.itemsInCart.map(item => {
        return {
          item: item.id,
          item_price: item.price,
          quantity: item.quantity
        }
      });

      let order = {
        "order_name": "ORDER" + Date.now(),
        "user": this.user.id,
        "start_tm": new Date(),
        "total_price": this.total,
        "order_status": "pending",
        "restaurant": this.restaurantId,
        "items": this.itemsInCart.map(item => item.id),
        "quantity": quantity
      }

      if(this.coupon) {
        order['coupon'] = this.coupon.id;
      }

      this.orderService.createOrder(order).subscribe(data => {
        // console.log("DATA", data);
        this.cartService.clearCart();
        this.navCtrl.push('OrderDetailsPage', {
          order: data['id'],
        });

      }, error => {
          console.log("ERROR", error);
      });
    } else {
      this.showToaster("Unable to retrieve the user info");
    }



  }

  addCouponPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Add coupon',
      inputs: [
        {
          name: 'coupon',
          placeholder: 'Coupon'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Apply',
          handler: data => {
            console.log("DATA", data);

            // check if the coupon is valid or not
            this.orderService.checkIfCouponValid(data.coupon)
            .subscribe((coupons: Array<any>) => {

              console.log("COUPONS", coupons);

              if(coupons && coupons.length > 0) {
                  this.coupon = coupons.find(c => c.name === data.coupon);
                  const discount = this.coupon.discount;
                  this.coupon_discount_amount = (discount / 100) * this.total;
                  this.grandTotal = this.total - this.coupon_discount_amount;
                  this.isCouponApplied = true;
                  console.log("COUPON VALID");
                  this.showToaster("Coupon Applied");
                } else {
                  this.showToaster("Coupon invalid");
                }
            }, error => {
              console.log("COUPON INVALID", error);
              this.showToaster("Coupon invalid");
            })

          }
        }
      ]
    });

    alert.present();
  }




}
