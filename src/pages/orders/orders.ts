import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from "ionic-angular";
import { OrdersService } from "./orders.service";
import { ConstantService } from '../../app/constant.service';

@IonicPage()
@Component({
  selector: "page-orders",
  templateUrl: "orders.html",
  providers: [OrdersService]
})
export class OrdersPage {
  orders: string;
  deliveredList: any[] = [];
  pendingList: any[] = [];

  ordersList:Array<any>;

  apiUrl = this.constantService.testApi;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public orderService: OrdersService,
    public loadingCtrl: LoadingController,
    private constantService: ConstantService
  ) {
    this.orders = "history";
    // this.getAllDeliveredOrders();
    this.getAllPendingOrders();
  }

  // get all list of delivered and canceled orders
  getAllDeliveredOrders() {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.orderService.getDelivedOrders().subscribe(
      (res: any) => {
        loader.dismiss();
        this.deliveredList = res;
      },
      error => {
        loader.dismiss();
      }
    );
  }

  // get list of pending orders
  getAllPendingOrders() {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.orderService.getPendingOrders().subscribe(
      (res: any) => {

        this.ordersList = res;
        console.log("ORDER LISTT", this.ordersList);
        loader.dismiss();

      },
      error => {
        loader.dismiss();
      }
    );
  }

  //Go to order detail page to view order detail
  onViewDeliveredOrder(id) {
    this.navCtrl.push("OrderDetailsPage", {
      order: id
    });
  }

  // Go to order track page to check order status
  tarckOrder(item) {
    this.navCtrl.push("TrackOrderPage", {
      order: item
    });
  }
}
