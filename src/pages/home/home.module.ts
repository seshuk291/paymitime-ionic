import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { HomePage } from "./home";
import { TranslateModule } from "@ngx-translate/core";
// import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
//import { Ionic2RatingModule } from 'ionic2-rating';
@NgModule({
  declarations: [HomePage],
  imports: [IonicPageModule.forChild(HomePage), TranslateModule],
})
export class HomePageModule {}
