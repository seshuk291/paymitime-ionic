import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  ToastController,
  LoadingController
} from 'ionic-angular';
import { ProfileService } from './profile.service';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { ConstantService } from '../../app/constant.service';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [ProfileService]
})
export class ProfilePage {
  apiUrl = this.constantService.testApi;

  public profile: any = {
    username: '',
    mobile: 0,
    locationName: '',
    city: '',
    state: '',
    country: '',
    zip: 0,
    address: '',
    logo: '',
    publicId: ''
  };

  public url = 'assets/imgs/p3.jpg';

  cloudinaryUpload = {
    cloudName: 'impnolife',
    uploadPreset: 'mspqunld'
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
    private loadingCtrl: LoadingController,
    private constantService: ConstantService
  ) {
    this.getUserDetail();
  }

  // used for get user detail
  getUserDetail() {
    const loader = this.loadingCtrl.create({
      content: 'Please wait'
    });
    loader.present();
    this.profileService.getUserDetails().subscribe(
      (res: any) => {
        localStorage.setItem('userId', res.id);

        for (const key in this.profile) {
          if (this.profile.hasOwnProperty(key)) {
            this.profile[key] = res[key];
          }
        }

        if (res.profileimg) {
          this.url = this.apiUrl + res.profileimg.url;
        }
        loader.dismiss();
      },
      error => {
        loader.dismiss();
      }
    );
  }

  flag;
  // Update user detail
  onSubmitProfile() {
    console.log('PROFILE', this.profile);

    const formData = new FormData();

    // create formData object and append all the properties to that object
    for (const key in this.profile) {
      if (this.profile.hasOwnProperty(key)) {
        const element = this.profile[key];
        formData.append(key, element);
      }
    }

    if (this.image) {
      formData.append('profileimg', this.image);
    }

    const loader = this.loadingCtrl.create({
      content: 'Please wait'
    });

    loader.present();

    let userId = localStorage.getItem('userId');
    console.log('USER ID', userId);
    this.profileService.UpdateUserProfile(formData, userId).subscribe(
      (res: any) => {

        console.log("result**", res);

        this.profileService._currentUser.next(res);
        // this.profileService.currentUser = res;
        this.showToaster('Profile has been updated!');
        loader.dismiss();
      },
      error => {
        loader.dismiss();
      }
    );
  }

  image;
  // Used for read image from local system
  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      this.image = event.target.files[0];

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
