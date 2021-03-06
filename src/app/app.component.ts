import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SocketService } from '../providers/socket-service';
import { UserService } from '../providers/user-service';
import { ProfileService } from '../pages/profile/profile.service';
import { Geolocation } from '@ionic-native/geolocation';
import { CartService } from '../data-services/cart.service';
import { OneSignal } from '@ionic-native/onesignal';
import { AlertController } from 'ionic-angular';
import { ConstantService } from './constant.service';
import { OnInit } from '@angular/core';

@Component({
  templateUrl: 'app.html',
  providers: [
    SocketService,
    UserService,
    ProfileService,
    Geolocation,
    OneSignal
  ]
})
export class MyApp implements OnInit {
  public deliveryInfo: any = {};
  public restaurantDetail: any = {};
  @ViewChild(Nav) nav: Nav;

  rootPage: string;
  imageUrl: string = 'assets/imgs/p3.jpg';
  username: string;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public events: Events,
    private toastCtrl: ToastController,
    public socketService: SocketService,
    public profileService: ProfileService,
    private geoLocation: Geolocation,
    public oneSignal: OneSignal,
    private cartService: CartService,
    private alertCtrl: AlertController,
    private constantService: ConstantService
  ) {


    this.getProfileInfo();
    this.getCurrentPosition();
    this.initializeApp();

    // update the cart with locally stored cart items
    const itemString = localStorage.getItem('items');

    if (itemString) {
      const items = JSON.parse(itemString);

      if (items && items.length > 0) {
        console.log('populating cart with local storage');
        items.forEach(item => {
          this.cartService.addItem(item);
        });
      }

    }



    // OneSignal Connection Setup
    //   platform.ready().then(res => {
    //     if (res == "cordova") {
    //       this.oneSignal.startInit(
    //         "230d3e93-0c29-49bd-ac82-ecea8612464e",
    //         "714618018341"
    //       );
    //       this.oneSignal.inFocusDisplaying(
    //         this.oneSignal.OSInFocusDisplayOption.InAppAlert
    //       );
    //       this.oneSignal.handleNotificationReceived().subscribe(() => { });
    //       this.oneSignal.handleNotificationOpened().subscribe(() => { });
    //       this.oneSignal.endInit();
    //     }
    //     // statusBar.styleBlackTranslucent();
    //     statusBar.backgroundColorByHexString('#882725');
    //     // statusBar.overlaysWebView(false);
    //     splashScreen.hide();
    //   });
    // }
  }



  ngOnInit() {

    this.profileService.currentUser$.subscribe(user => {
      console.log("Current username", this.profileService.currentUser);
      this.username = this.profileService.currentUser.username;
      if(this.profileService.currentUser && this.profileService.currentUser.profileimg) {
        this.imageUrl = this.constantService.testApi + this.profileService.currentUser.profileimg.url;
      }
    });
  }


  // Get user information
  private getProfileInfo() {
    if (localStorage.getItem('jwtToken') != null) {

      this.profileService.getUserDetails().subscribe((res: any) => {
        this.profileService._currentUser.next(res);
      });

    }
  }

  // Used for get restaurant detail and delivery Information Published event from ProductDetailsPage
  initializeApp() {
    this.events.subscribe('restInfo', (res: any) => {
      this.deliveryInfo = res.delivery;
      this.restaurantDetail = res.restaurant;
    });
    this.platform.ready().then(() => {
      // this.statusBar.styleBlackTranslucent();
      this.statusBar.backgroundColorByHexString('##882725');
      // this.statusBar.overlaysWebView(false);
      this.splashScreen.hide();

      if (this.platform.is('cordova')) {
        this.setupPush();
      }
    });
  }

  setupPush() {
    // I recommend to put these into your environment.ts
    this.oneSignal.startInit(
      '734e29e5-cf07-4eff-b117-166075b69e2b',
      '564390866638'
    );

    this.oneSignal.setSubscription(true);

    // alert("Your user id: " + );

    this.oneSignal.getPermissionSubscriptionState().then(permissionState => {
      alert("state" + JSON.stringify(permissionState));
    })

    this.oneSignal.inFocusDisplaying(
      this.oneSignal.OSInFocusDisplayOption.None
    );

    // Notifcation was received in general
    this.oneSignal.handleNotificationReceived().subscribe(data => {
      let msg = data.payload.body;
      let title = data.payload.title;
      let additionalData = data.payload.additionalData;
      this.showAlert(title, msg, additionalData.task);
    });

    // // Notification was really clicked/opened
    // this.oneSignal.handleNotificationOpened().subscribe(data => {
    //   // Just a note that the data is a different place here!
    //   let additionalData = data.notification.payload.additionalData;

    //   this.showAlert('Notification opened', 'You already read this before', additionalData.task);
    // });

    this.oneSignal.getIds().then(user => {
      alert('your userId' + user.userId);
    });

    this.oneSignal.endInit();
  }

  async showAlert(title, subTitle, task) {
    const alert = await this.alertCtrl.create({
      title,
      subTitle,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  // Get User current latitude and longitude
  private getCurrentPosition() {
    this.geoLocation
      .getCurrentPosition()
      .then(resp => {
        if (localStorage.getItem('position') != null) {
          const prevPosition = JSON.parse(localStorage.getItem('position'));
          const index = prevPosition.length;
          const singlePosition = prevPosition[index - 1];
          const distance = this.calculateDistance(
            { lat: singlePosition.lat, long: singlePosition.long },
            { lat: resp.coords.latitude, long: resp.coords.longitude }
          );
          if (distance > 0.99) {
            this.showToaster('Your lacation is different then before');
            this.rootPage = 'LocationChangerPage';
          } else {
            this.rootPage = 'HomePage';
          }
        } else {
          this.rootPage = 'LocationChangerPage';
        }
      })
      .catch(error => {
        this.rootPage = 'HomePage';
        this.showToaster(
          'Unable to get location. Fixed location will be used!'
        );
      });
  }

  // Calculate distance between two locations
  private calculateDistance(prevPosition, newPosition) {
    var R = 6371; // Radius of the earth in kilometers
    var dLat = this.deg2rad(newPosition.lat - prevPosition.lat); // deg2rad below
    var dLon = this.deg2rad(newPosition.long - prevPosition.long);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(prevPosition.lat)) *
        Math.cos(this.deg2rad(newPosition.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in KM
    return d;
  }

  private deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // checking token present or not in local storage
  isAuthenticated() {
    return localStorage.getItem('jwtToken') != null;
  }

  //used for logout
  logout() {
    localStorage.removeItem('jwtToken'); //remove only token. position will be needed
    this.login();
  }

  //used for Toaster generation
  showToaster(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  // Used for get restaurant detail and delivery Information Published event from ProductDetailsPage
  cart() {
    this.events.subscribe('restInfo', (res: any) => {
      this.deliveryInfo = res.delivery;
      this.restaurantDetail = res.restaurant;
    });
    if (localStorage.getItem('cartItem') != null) {
      this.nav.push('CartPage', {
        delivery: this.deliveryInfo,
        restaurant: this.restaurantDetail
      });
    } else {
      this.nav.push('CartPage');
    }
  }

  chatList() {
    this.nav.push('ChatListPage');
  }
  orderHistory() {
    this.nav.push('OrdersPage');
  }
  setting() {
    this.nav.push('SettingPage');
  }
  login() {
    this.nav.setRoot('LoginPage');
  }
  landin() {
    this.nav.setRoot('LandinPage');
  }
  home() {
    this.nav.setRoot('HomePage');
  }
  favourites() {
    this.nav.push('FavouritesPage');
  }
  profile() {
    this.nav.push('ProfilePage');
  }
  introduction() {
    this.nav.push('WelcomePage');
  }
  support() {
    this.nav.push('SupportPage');
  }
  about() {
    this.nav.push('AboutPage');
  }
  thankyou() {
    this.nav.push('ThankyouPage');
  }
}
