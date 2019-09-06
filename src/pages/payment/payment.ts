import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController
} from "ionic-angular";
import {
  PayPal,
  PayPalPayment,
  PayPalConfiguration
} from "@ionic-native/paypal";
import { Stripe } from "@ionic-native/stripe";
import { PaymentService } from "./payment.service";

//  Send Box Id's
const payPalEnvironmentSandbox =
  "AcgkbqWGamMa09V5xrhVC8bNP0ec9c37DEcT0rXuh7hqaZ6EyHdGyY4FCwQC-fII-s5p8FL0RL8rWPRB";
const publishableKey = "pk_test_mhy46cSOzzKYuB2MuTWuUb34";
const stripe_secret_key = "sk_test_GsisHcPqciYyG8arVfVe2amE";

@IonicPage()
@Component({
  selector: "page-payment",
  templateUrl: "payment.html",
  providers: [PaymentService, PayPal, Stripe]
})
export class PaymentPage implements OnInit {
  public orderData: any = {};
  private loader;
  public paymentDetails: any = {};
  public isStripePayment: boolean = false;
  public cardInfo: any = {
    cardNumber: "4242424242424242",
    expiryMonth: "02",
    expiryYear: "2020",
    cvc: "111"
  };
  public paymentTypes: any = [
    {
      default: true,
      type: "PayPal",
      value: "paypal",
      logo: "assets/imgs/paypal_logo.jpg"
    },
    {
      default: false,
      type: "Stripe",
      value: "stripe",
      logo: "assets/imgs/stripe.png"
    },
    { default: false, type: "COD", value: "cod", logo: "" }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public paymentService: PaymentService,
    public toastCtrl: ToastController,
    public payPal: PayPal,
    public stripe: Stripe,
    private loadingCtr: LoadingController
  ) {
    this.orderData = this.navParams.get("order");
    if (localStorage.getItem("position") != null) {
      const prevPosition = JSON.parse(localStorage.getItem("position"));
      const index = prevPosition.length;
      const singlePosition = prevPosition[index - 1];
      this.orderData.position = singlePosition;
    } else {
      this.orderData.position = {
        lat: "12.917096599999999",
        long: "77.58980509999999",
        name: "Current Position"
      };
    }
  }

  ngOnInit() {
    this.orderData.paymentOption = "PayPal";
  }

  // Select Payment Option
  choosePaymentType(paymentType) {
    if (paymentType == "Stripe") {
      this.isStripePayment = true;
    } else {
      this.isStripePayment = false;
    }
    this.orderData.paymentOption = paymentType;
    this.paymentDetails.paymentType = paymentType;
  }

  // Payment method
  saveOrder() {
    this.loader = this.loadingCtr.create({
      content: "Please wait..."
    });
    this.loader.present();

    if (this.orderData.paymentOption == "PayPal") {
      const config = {
        PayPalEnvironmentProduction: "",
        PayPalEnvironmentSandbox: payPalEnvironmentSandbox
      };
      this.paymentService.placeOrder(this.orderData).subscribe(
        (res: any) => {
          this.payPal.init(config).then(
            () => {
              this.payPal
                .prepareToRender(
                "PayPalEnvironmentSandbox",
                new PayPalConfiguration({})
                )
                .then(
                () => {
                  let payment = new PayPalPayment(
                    this.orderData.grandTotal,
                    "USD",
                    "Description",
                    "sale"
                  );

                  this.payPal.renderSinglePaymentUI(payment).then(
                    success => {
                      this.paymentDetails.transactionId = success.response.id;
                      this.savePaymentData(res._id, this.paymentDetails);
                    },
                    error => {
                      this.loader.dismiss();
                    }
                  );
                },
                error => {
                  this.loader.dismiss();
                }
                );
            },
            error => {
              this.loader.dismiss();
            }
          );
        },
        error => {
          this.loader.dismiss();
        }
      );
    } else if (this.orderData.paymentOption == "Stripe") {
      if (this.orderData.grandTotal >= 50) {
        this.paymentService.placeOrder(this.orderData).subscribe(
          (res: any) => {
            this.stripe.setPublishableKey(publishableKey);
            let card = {
              number: this.cardInfo.cardNumber,
              expMonth: this.cardInfo.expiryMonth,
              expYear: this.cardInfo.expiryYear,
              cvc: this.cardInfo.cvc
            };
            this.stripe
              .createCardToken(card)
              .then(token => {
                let stripe_token: any = token;
                if (token) {
                  this.paymentService
                    .chargeStripe(
                    stripe_token.id,
                    "USD",
                    Math.round(this.orderData.grandTotal),
                    stripe_secret_key
                    )
                    .then((result: any) => {
                      this.paymentDetails.transactionId =
                        result.balance_transaction;
                      this.cardInfo = "";
                      this.savePaymentData(res._id, this.paymentDetails);
                    });
                }
              })
              .catch(error => {
                this.loader.dismiss();
              });
          },
          error => {
            this.loader.dismiss();
          }
        );
      } else {
        this.loader.dismiss();
      }
    } else {
      this.placeOrder();
    }
  }

  // Placing Order
  placeOrder() {
    this.paymentService.placeOrder(this.orderData).subscribe(
      (res: any) => {
        localStorage.removeItem("cartItem");
        let message = "Order Placed Successfully";
        this.showToaster(message);
        this.loader.dismiss();
        this.navCtrl.setRoot("ThankyouPage");
      },
      error => {
        this.loader.dismiss();
      }
    );
  }

  // Update Order Data after payment by PayPal or stripe
  savePaymentData(orderId, paymentDetails) {
    this.paymentService.savePayemntData(orderId, paymentDetails).subscribe(
      res => {
        localStorage.removeItem("cartItem");
        this.loader.dismiss();
        this.navCtrl.setRoot("ThankyouPage");
      },
      error => {
        this.loader.dismiss();
      }
    );
  }

  // Show toaster message
  showToaster(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
