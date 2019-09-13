import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  Events,
  Platform,
  LoadingController
} from "ionic-angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { LoginService } from "./login.service";
import { ProfileService } from "./../profile/profile.service";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook";
import { GooglePlus } from "@ionic-native/google-plus";
import { TwitterConnect } from "@ionic-native/twitter-connect";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html",
  providers: [
    ProfileService,
    Facebook,
    GooglePlus,
    TwitterConnect
  ]
})
export class LoginPage implements OnInit {
  remember: boolean;
  login: FormGroup;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loginService: LoginService,
    private profileService: ProfileService,
    public toastCtrl: ToastController,
    private events: Events,
    public facebook: Facebook,
    public googlePlus: GooglePlus,
    public twitter: TwitterConnect,
    public platform: Platform,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.login = new FormGroup({
      email: new FormControl("johndoe@gmail.com", Validators.required),
      password: new FormControl("johndoe", Validators.required)
    });
  }

  //Used to submit login credential
  onLogin() {
    const loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    let user = {
      identifier: this.login.value.email,
      password: this.login.value.password
    };
    this.loginService.onLoginData(user).subscribe(
      (res: any) => {
        localStorage.setItem("jwtToken", res.jwt);

        this.profileService.getUserDetails().subscribe(
          (res: any) => {
            this.events.publish("userInfo", res);


            if(!res.confirmed) {
              this.showToaster("Your account is not at confirmed");
            }

            if(res.blocked) {
              this.showToaster("Your account is blocked");
            }

            if(res.confirmed && !res.blocked) {
              this.navCtrl.setRoot("HomePage");
              this.showToaster("Login successful");
            }


            loader.dismiss();
          },
          error => {
            loader.dismiss();
          }
        );
      },
      (error) => {
        this.showToaster("email or password is incorrect");
        loader.dismiss();
        // console.log('error---',JSON.stringify(error));
      }
    );
  }

  //To get user info from facebook and send it to server side

  facebookLogin() {
    const loader = this.loadingCtrl.create({
      content: "Please wait"
    });
    loader.present();
    const permissions = [
      "public_profile",
      "email",
      "user_friends"
    ];
    this.facebook
      .login(permissions)
      .then((res: FacebookLoginResponse) => {
        console.log("Res",JSON.stringify(res));
        this.facebook
          .api(
          "/me?fields=id,name,email,gender,first_name,last_name,picture.width(720).height(720).as(imageId)",
          permissions
          )
          .then(
          data => {
            console.log("data--", JSON.stringify(data));
            let userInfo = {
              id: data.id,
              name: data.name,
              email: data.email,
              imageId: data.imageId.data.url
            };
            this.loginService.loginUserViaFacebook(userInfo).subscribe(
              (re: any) => {
                console.log("token", JSON.stringify(re));
                localStorage.setItem("token", re.token);
                loader.dismiss();
                this.events.publish("userInfo", {
                  name: data.name,
                  logo: data.imageId.data.url
                });
                this.showToaster("Registration successful!");
                this.navCtrl.setRoot("HomePage");
              },
              error => {
                loader.dismiss();
                this.showToaster(error.error.message);
              }
            );
          },
          error => {
            loader.dismiss();
          }
          )
          .catch(e => {
            loader.dismiss();
          });
      })
      .catch(e => {
        loader.dismiss();
        this.showToaster("error while login " + e.message);
      });
  }

  //To get user info from google and send it to server side
  googleLogin() {
    const loader = this.loadingCtrl.create({
      content: "Please wait"
    });
    loader.present();
    // console.log("IN");
    this.googlePlus.login({}).then(success => {
        // console.log("then", JSON.stringify(success));
        const userInfo = {
          imageId: success.imageUrl,
          name: success.displayName,
          googleId: success.userId,
          email: success.email
        };
        this.loginService.loginUserViaGoogle(userInfo).subscribe(
          (re: any) => {
            // console.log("LOGIN", JSON.stringify(re));
            localStorage.setItem("token", "bearer " + re.token);
            loader.dismiss();
            this.events.publish("userInfo", {
              name: success.displayName,
              logo: success.imageUrl
            });
            this.showToaster("Registration successful!");
            this.navCtrl.setRoot("HomePage");
          },
          error => {
            loader.dismiss();
            this.showToaster(error.error.message);
          }
        );
      },
      error => {
        loader.dismiss();
        this.showToaster(error.messsage);
      })
      .catch(e => {
        console.log("Error", e);
        loader.dismiss();
      });
  }

  //To get user info from twitter and send it to server side
  twitterLogin() {
    const loader = this.loadingCtrl.create({
      content: "Please wait"
    });
    loader.present();
    this.platform
      .ready()
      .then(res => {
        if (res == "cordova") {
          this.twitter
            .login()
            .then(result => {
              this.twitter.showUser().then(
                user => {
                  console.log("user" + JSON.stringify(user));
                  //here post data to Api
                  localStorage.setItem("user", user.id);
                  loader.dismiss();
                  this.navCtrl.setRoot("HomePage");
                },
                onError => {
                  loader.dismiss();
                  console.log("user" + JSON.stringify(onError));
                }
              );
            })
            .catch(Error => {
              loader.dismiss();
              console.log("twitter error--", Error);
            });
        }
      })
      .catch(e => {
        loader.dismiss();
      });
    console.log("not yet implemented");
  }

  // show toaster message
  showToaster(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  // loginGoogle() {
  //   this.googlePlus.login({})
  //     .then(res => console.log(res))
  //     .catch(err => console.error(err));
  // }
}
