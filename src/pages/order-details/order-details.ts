import { OrdersService } from './../orders/orders.service';
import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  AlertController
} from 'ionic-angular';

declare var RazorpayCheckout: any;

@IonicPage()
@Component({
  selector: 'page-order-details',
  templateUrl: 'order-details.html',
  providers: [OrdersService]
})
export class OrderDetailsPage {
  orderTotalCost: number;
  grandTotalCost: number;
  public orderDetail: any = {};
  public orderId: string;
  public ratingList: any[] = [];
  public showRating: boolean = false;
  public items: Array<any>;
  coupon: any;

  discountForTime: number;
  discountedAmountForTime: number;
  discountAmount: number;

  interval;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public orderService: OrdersService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private alertController: AlertController
  ) {
    this.orderId = this.navParams.get('order');
    console.log('ORDER ID', this.orderId);
    this.getOrderData(this.orderId);
  }

  // get order details by order id
  getOrderData(id) {
    let loader = this.loadingCtrl.create({ content: 'Please wait...' });
    loader.present();
    this.orderService.getOrderDataById(id).subscribe(
      (res: any) => {
        this.orderDetail = res;

        // actual item object
        const items = this.orderDetail.items;

        // items in order with id, price and quantity
        const quantity = this.orderDetail.quantity;
        this.orderTotalCost = 0;
        quantity.forEach(item => {
          let foundItem = items.find(i => i.id == item.item);
          if (foundItem) {
            item.name = foundItem.name;
          } else {
            item.name = '';
          }
          this.orderTotalCost =
            this.orderTotalCost + item.quantity * item.item_price;
        });

        this.items = quantity;

        if (this.orderDetail && this.orderDetail.coupon) {
          this.coupon = this.orderDetail.coupon;
          if (this.coupon) {
            const discount = this.coupon.discount;
            this.discountAmount = (discount / 100) * this.orderTotalCost;
            this.grandTotalCost = this.orderTotalCost - this.discountAmount;
          }
        } else {
          this.grandTotalCost = this.orderTotalCost;
        }

        // this.ratingList = res.productRating;
        // if (this.ratingList.length == 0) {
        //   this.showRating = true;
        // } else {
        //   this.showRating = false;
        // }

        // console.log('====================================');
        // console.log('ORDER TOTAL COST', this.orderTotalCost);
        // console.log('ORDER GRAND TOTAL COST', this.grandTotalCost);
        // console.log('TOTAL DISCOUNT AMOUNT', this.discountAmount);
        // console.log('ORDER COUPON', this.coupon);
        // console.log('====================================');

        this.startTimer();
        loader.dismiss();
      },
      error => {
        loader.dismiss();
        this.showToaster('Something Went Wrong');
      }
    );
  }

  // Go to rate page for ratting
  rateProduct(productId) {
    // let ratingInfo: any = {};
    // ratingInfo.orderId = this.orderDetail._id;
    // ratingInfo.restaurantID = this.orderDetail.restaurantID;
    // ratingInfo.categoryId = this.orderDetail.category;
    // ratingInfo.product = productId;
    // ratingInfo.location = this.orderDetail.location;
    // ratingInfo.userId = this.orderDetail.user._id;
    // this.navCtrl.push("RatingPage", {
    //   ratingInfo: ratingInfo
    // });
  }

  // show toaster message
  showToaster(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  progress: any = 0;
  overallProgress: any = 0;
  percent: number = 0;
  timeToCount: number = 30; // time in minutes
  radius = 100;
  counter = 0;
  secondsToDisplay = 0;
  minutesToDisplay = 0;

  startTimer() {
    let fromDate = new Date(this.orderDetail.start_tm);
    let nowDate = new Date();

    let fromTime = fromDate.getTime();
    let nowTime = nowDate.getTime();
    let diff = nowTime - fromTime;
    let time = this.convertMS(diff);

    if (
      (time && this.orderDetail.order_status === 'pending') ||
      (time && this.orderDetail.order_status === 'confirmed')
    ) {
      if (time && time.day > 0) {
        time.minute = time.minute + time.day * 1440;
      }

      if (time && time.hour > 0) {
        time.minute = time.minute + time.hour * 60;
      }

      this.minutesToDisplay = time.minute;
      this.secondsToDisplay = time.seconds;

      const totalSeconds = this.timeToCount * 60;

      this.interval = setInterval(() => {
        if (this.minutesToDisplay < 20 && this.minutesToDisplay > 10) {
          this.calculateDiscount(20);
        } else {
          this.calculateDiscount(10);
        }

        // console.log("========== DISCOUNT ===========");
        // console.log('DISCOUNT', this.discountForTime);
        // console.log('DISCOUNT AMOUNT FOR TIME', this.discountedAmountForTime);
        // console.log('TOTAL COST', this.orderTotalCost);
        // console.log('GRAND TOTAL', this.grandTotalCost);
        // console.log("========== ***DISCOUNT*** ===========");

        this.counter++;

        this.secondsToDisplay++;

        if (this.percent === this.radius) {
          clearInterval(this.interval);
        }

        this.percent = Math.floor((this.progress / totalSeconds) * 100);
        // console.log('percent : ', this.percent);
        this.progress++;

        if (this.secondsToDisplay == 60) {
          this.secondsToDisplay = 0;
          this.minutesToDisplay++;
        }

        if (this.minutesToDisplay == 30) {
          this.minutesToDisplay = 0;
        }
      }, 1000);
    }
  }

  convertMS(milliseconds) {
    let day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
      day: day,
      hour: hour,
      minute: minute,
      seconds: seconds
    };
  }

  calculateDiscount(discountPercent) {
    this.discountForTime = discountPercent;

    if (this.coupon && this.discountAmount) {
      this.discountedAmountForTime =
        (this.discountForTime / 100) * this.orderTotalCost;
      this.grandTotalCost =
        this.orderTotalCost -
        (this.discountedAmountForTime + this.discountAmount);
    } else {
      this.discountedAmountForTime =
        (this.discountForTime / 100) * this.orderTotalCost;
      this.grandTotalCost = this.orderTotalCost - this.discountedAmountForTime;
    }
  }

  showInvoice;

  time = {
    minutes: 0,
    seconds: 0
  }

  payBill() {
    this.time.minutes = this.minutesToDisplay;
    this.time.seconds = this.secondsToDisplay;
    this.showInvoice = !this.showInvoice;
  }

  checkOut() {
    this.payWithRazor();
  }

  currency: string = 'INR';
  currencyIcon: string = '₹';
  razor_key = 'rzp_test_3mC3Q72xHtdata';
  cardDetails: any = {};

  payWithRazor() {
    const options = {
      description: 'Payment for the order',
      currency: this.currency,
      key: this.razor_key,
      amount: this.grandTotalCost * 100,
      name: 'Paymitime',
      modal: {
        ondismiss: function() {
          alert('dismissed');
        }
      }
    };

    var self = this;

    var successCallback = function(payment_id) {
      // alert('payment_id: ' + payment_id);
      self.onPaymentSuccess(payment_id);
    };

    var cancelCallback = function(error) {
      alert(error.description + ' (Error ' + error.code + ')');
    };

    RazorpayCheckout.open(options, successCallback, cancelCallback);
  }

  onPaymentSuccess(paymentId) {
    this.showToaster('Payment successful');

    this.orderService
      .updateOrder(this.orderDetail.id, {
        order_status: 'completed',
        payment_id: paymentId
      })
      .subscribe(
        res => {
          if (this.interval) {
            clearInterval(this.interval);
          }

          this.navCtrl.push('OrdersPage');
        },
        error => {
          this.showToaster('Payment failed');
        }
      );
  }
}
