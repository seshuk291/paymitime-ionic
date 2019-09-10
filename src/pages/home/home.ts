import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  IonicPage,
  LoadingController,
  AlertController,
  ToastController
} from 'ionic-angular';
import { HomeService } from './home.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ConstantService } from '../../app/constant.service';
import { map } from 'rxjs/operators/map';
import { CartService } from '../../data-services/cart.service';

// import { ToastController } from '@ionic/angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [HomeService]
})
export class HomePage {
  event: string;
  searchBoxVisible = false;
  btnsVisible = true;
  public visible = false;
  public restaurantListByPosition: any[] = [];
  public restaurantListByRating: any[] = [];
  public restaurantListAsNewlyArrived: any[] = [];

  apiUrl = this.constantService.testApi;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public homeService: HomeService,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private constantService: ConstantService,
    private barcodeScanner: BarcodeScanner,
    private toastController: ToastController,
    public alertController: AlertController,
    private cartService: CartService
  ) {
    this.getRestaurantAsNewlyArrived();
    this.getRestaurantsByRating();
  }

  ionViewWillLoad() {


    if (localStorage.getItem('position') != null) {
      const prevPosition = JSON.parse(localStorage.getItem('position'));
      const index = prevPosition.length;
      const singlePosition = prevPosition[index - 1];

      console.log('singlePosition', singlePosition);

      // this.getRestaurantsByPosition(singlePosition.lat, singlePosition.long);
    } else {
      // this.getRestaurantsByPosition("12.917096599999999", "77.58980509999999");
      //static location will be used in  case when dynamic location is not available
    }

    console.log('ION View will load');

    this.getRestaurantsByPosition('12.917096599999999', '77.58980509999999');
  }
  // used for bottom tab

  // Used for get restaurant list by latitude and longitude
  private getRestaurantsByPosition(lat, lng) {
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present();
    this.homeService
      .getRestaurantsByPosition(lat, lng)
      .pipe(map((restaurants: Array<any>) => restaurants.splice(0, 6)))
      .subscribe(
        (res: any) => {
          console.log('RES', res);
          this.restaurantListByPosition = res;
          loader.dismiss();
        },
        error => {
          loader.dismiss();
        }
      );
  }

  // Used for get restaurant list by Rating
  private getRestaurantsByRating() {
    this.homeService.getRestaurantsByRating().subscribe(
      (res: any) => {
        if (res.message) {
        } else {
          this.restaurantListByRating = res;
        }
      },
      error => {}
    );
  }

  // Used for get restaurant list newly arrived
  private getRestaurantAsNewlyArrived() {
    this.homeService.getRestaurantAsNewlyArrived().subscribe(
      (res: any) => {
        if (res.message) {
        } else {
          this.restaurantListAsNewlyArrived = res;
        }
      },
      error => {}
    );
  }

  /*Used for selecting restaurant and move to next page RestaurantDetailsPage if resturant already selected
  than changed by removing all cart item
  */
  onSelectRestaurant(restaurantID: any) {
    console.log('RESTAURANT ID', restaurantID);

    this.navCtrl.push('RestaurantDetailsPage', {
      id: restaurantID,
      mode: 'routing'
    });

    // console.log("Restaurant Id", restaurantID);
    // if (localStorage.getItem('cartItem') == null) {
    //   localStorage.setItem('rid', restaurantID);
    //   this.navCtrl.push('RestaurantDetailsPage', {
    //     id: restaurantID
    //   });
    // } else {
    //   const tempRid = localStorage.getItem('rid');
    //   if (tempRid == restaurantID) {
    //     this.navCtrl.push('RestaurantDetailsPage', {
    //       id: restaurantID
    //     });
    //   } else {
    //       let alert = this.alertCtrl.create({
    //       title: 'Are you sure?',
    //       message: 'To change restaurant you have to clear your cart!',
    //       buttons: [
    //         {
    //           text: 'Nope',
    //           role: 'cancel',
    //           handler: () => {
    //             //handle if dont want to clear cart
    //           }
    //         },
    //         {
    //           text: 'Sure',
    //           handler: () => {
    //             localStorage.removeItem('cartItem');
    //             localStorage.setItem('rid', restaurantID);
    //             this.navCtrl.push('RestaurantDetailsPage', {
    //               id: restaurantID
    //             });
    //           }
    //         }
    //       ]
    //     });
    //     alert.present();
    //   }
    // }
  }

  searchVisible() {
    this.searchBoxVisible = true;
    this.btnsVisible = false;
  }
  btnVisible() {
    this.searchBoxVisible = false;
    this.btnsVisible = true;
  }
  toggle() {
    this.visible = !this.visible;
  }

  goToLocationChangerPage() {
    this.navCtrl.push('LocationChangerPage');
  }

  goToAllRestaurantPage(pageValue) {
    console.log('[VIEW ALL] Page value', pageValue);

    this.navCtrl.push('AllRestaurantPage', { pageValue: pageValue });
  }

  scan() {
    console.log('Tried to open scanner');

    // const toast =  this.toastController.create({
    //   message: 'The timer has started.',
    //   duration: 2000
    // });
    // toast.present();
    // console.log('Barcode data', JSON.stringify(barcodeData));

    this.barcodeScanner
      .scan()
      .then(barcodeData => {
       // console.log('Barcode data', JSON.stringify(barcodeData));

        if (!barcodeData.cancelled) {
          this.navCtrl.push('RestaurantDetailsPage', {
            id: barcodeData.text,
            mode: 'QR_SCAN'
          });
        }
      })
      .catch(err => {
        console.log('Error', err);
      });
  }

  //used in slider in homepage
  offers = [
    {
      img: 'assets/imgs/bg1.jpg',
      title: 'Buy 1 & Get 1 Free',
      describe: 'Veg Paneer Roll at just Rs.25',
      tagline: 'Tap here to see Offer'
    },
    {
      img: 'assets/imgs/bg6.jpg',
      title: 'Kitchen Offers',
      describe: 'Veg Paneer Roll at just Rs.25',
      tagline: 'Order now...! Hurry up'
    },
    {
      img: 'assets/imgs/bg.jpg',
      title: 'Book a Table with 50% Off',
      describe: 'Veg Paneer Roll at just Rs.25',
      tagline: 'Grab it...!!!'
    }
  ];

  ads = [
    {
      img: 'assets/imgs/ad1.jpg'
    },
    {
      img: 'assets/imgs/ad2.png'
    },
    {
      img: 'assets/imgs/ad3.jpg'
    },
    {
      img: 'assets/imgs/ad4.jpg'
    }
  ];
}
