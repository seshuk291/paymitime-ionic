import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  ToastController,
  LoadingController
} from "ionic-angular";
import { ProfileService } from "./profile.service";
import { CloudinaryOptions, CloudinaryUploader } from "ng2-cloudinary";

@IonicPage()
@Component({
  selector: "page-profile",
  templateUrl: "profile.html",
  providers: [ProfileService]
})
export class ProfilePage {
  public profile: any = {
    name: "",
    contactNumber: 0,
    locationName: "",
    city: "",
    state: "",
    country: "",
    zip: 0,
    address: "",
    logo: "",
    publicId: "",
    flag: 0
  };
  public url = "assets/imgs/p3.jpg";
  cloudinaryUpload = {
    cloudName: "impnolife",
    uploadPreset: "mspqunld"
  };

  uploader: CloudinaryUploader = new CloudinaryUploader(
    new CloudinaryOptions(this.cloudinaryUpload)
  );

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public profileService: ProfileService,
    public toastCtrl: ToastController,
    private events: Events,
    private loadingCtrl: LoadingController
  ) {
    this.getUserDetail();
  }

  // used for get user detail
  getUserDetail() {
    const loader = this.loadingCtrl.create({
      content: "Please wait"
    });
    loader.present();
    this.profileService.getUserDetails().subscribe(
      (res: any) => {
        localStorage.setItem("userId", res._id);
        this.profile = res;
        if (res.logo != null) {
          this.url = res.logo;
        }
        loader.dismiss();
      },
      error => {
        loader.dismiss();
      }
    );
  }

  // Update user detail
  onSubmitProfile() {
    const loader = this.loadingCtrl.create({
      content: "Please wait"
    });
    loader.present();
    if (
      this.profile.contactNumber > 999999999 &&
      this.profile.contactNumber < 10000000000
    ) {
      if (this.profile.flag == 1) {
        this.uploader.uploadAll();
        this.uploader.onSuccessItem = (
          item: any,
          response: string,
          status: number,
          headers: any
        ): any => {
          let res: any = JSON.parse(response);
          this.profile.logo = res.secure_url;
          this.profile.publicId = res.public_id;
          let userId = localStorage.getItem("userId");
          this.profileService.UpdateUserProfile(this.profile, userId).subscribe(
            (res: any) => {
              this.events.publish("userInfo", res);
              this.showToaster("Profile has been updated!");
              loader.dismiss();
            },
            errotr => {
              loader.dismiss();
            }
          );
        };
      } else {
        let userId = localStorage.getItem("userId");
        this.profileService.UpdateUserProfile(this.profile, userId).subscribe(
          (res: any) => {
            this.events.publish("userInfo", res);
            this.showToaster("Profile has been updated!");
            loader.dismiss();
          },
          error => {
            loader.dismiss();
          }
        );
      }
    } else {
      loader.dismiss();
      this.showToaster("Please enter valid contact number!");
    }
  }

  // Used for read image from local system
  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.profile.flag = 1;
      };
      reader.readAsDataURL(event.target.files[0]);
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
