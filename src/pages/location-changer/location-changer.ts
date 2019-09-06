import { Component, ElementRef, NgZone, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  ToastController,
  LoadingController
} from "ionic-angular";
import { MapsAPILoader } from "@agm/core";
import { Geolocation } from "@ionic-native/geolocation";

declare var google;

@IonicPage()
@Component({
  selector: "page-location-changer",
  templateUrl: "location-changer.html",
  providers: [Geolocation]
})
export class LocationChangerPage {
  @ViewChild("search") searchElementRef: ElementRef;
  public previousPositions: Array<{ long; lat; name }> = [];
  public positionName: string;
  public zoom: number = 16; //default map zoom
  origin: { longitude: number; latitude: number } = {
    //default lat long --required
    longitude: 77.6412,
    latitude: 12.9719
  };
  destination: { longitude: number; latitude: number } = {
    longitude: 77.6412,
    latitude: 12.9719
  };

  constructor(
    public mapsAPILoader: MapsAPILoader,
    public ngZone: NgZone,
    private geolocation: Geolocation,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  // Used to get current latitude and longitude for origin and destination
  // autocompletion for location search
  ionViewWillEnter() {
    const loader = this.loadingCtrl.create({
      content: "Please wait.."
    });
    loader.present();
    if (localStorage.getItem("position") != null) {
      this.previousPositions = JSON.parse(localStorage.getItem("position"));
    }
    this.geolocation
      .getCurrentPosition()
      .then(resp => {
        this.zoom = 16;
        this.destination.latitude = resp.coords.latitude;
        this.destination.longitude = resp.coords.longitude;
        if (localStorage.getItem("position") != null) {
          const prevPosition = JSON.parse(localStorage.getItem("position"));
          const index = prevPosition.length;
          const singlePosition = prevPosition[index - 1];
          this.destination.latitude = singlePosition.lat;
          this.destination.longitude = singlePosition.long;
          this.origin.latitude = singlePosition.lat;
          this.origin.longitude = singlePosition.long;
        } else {
          this.origin = this.destination;
        }
        loader.dismiss();
      })
      .catch(error => {
        loader.dismiss();
        this.showToaster("Location is not working properly. Try again later!");
      });
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place = autocomplete.getPlace();
          console.log("selected value--1", place.name);
          this.positionName = place.name ? place.name : "Not available";
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.destination.latitude = place.geometry.location.lat();
          this.destination.longitude = place.geometry.location.lng();
          this.zoom = 16;
        });
      });
    });
  }

  //method to delete one item from one recent search
  onClickDelete(i) {
    this.previousPositions.splice(i, 1);
  }

  //set destination location on selecting item from receent  list
  onClickItem(position) {
    this.destination.latitude = position.lat;
    this.destination.longitude = position.long;
    this.positionName = position.name;
    this.onChooseLocation();
  }

  // method to set current location as choosen location
  onClickUseCurrentLocation() {
    const loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.zoom = 16;
    this.geolocation
      .getCurrentPosition()
      .then(resp => {
        this.destination.latitude = resp.coords.latitude;
        this.destination.longitude = resp.coords.longitude;
        this.positionName = this.positionName
          ? this.positionName
          : "Current location";
        this.showToaster(this.positionName + " is selected");
        console.log("position---", resp);
        loader.dismiss();
        this.onChooseLocation();
      })
      .catch(error => {
        loader.dismiss();
        this.showToaster(
          "location is not available currently. select from recent if available!"
        );
      });
  }

  /* this method will store selected location and it will store it to localstorage
    and splice one item if same is already available  
  */
  onChooseLocation() {
    // required
    if (this.positionName == "Not available") {
      this.showToaster("Please search or choose any previous location!");
    } else {
      let positionObj = {
        lat: this.destination.latitude,
        long: this.destination.longitude,
        name: this.positionName
      };
      for (let i = 0; i < this.previousPositions.length; i++) {
        if (this.previousPositions[i].name == positionObj.name) {
          this.previousPositions.splice(i, 1);
        }
      }
      this.previousPositions.push(positionObj);
      localStorage.setItem("position", JSON.stringify(this.previousPositions));
      this.navCtrl.setRoot("HomePage");
    }
  }

  showToaster(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}