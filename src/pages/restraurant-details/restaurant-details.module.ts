import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { RestaurantDetailsPage } from "./restaurant-details";
import { TranslateModule } from "@ngx-translate/core";
import { CartService } from '../../data-services/cart.service';

@NgModule({
  declarations: [RestaurantDetailsPage],
  imports: [IonicPageModule.forChild(RestaurantDetailsPage), TranslateModule],
  // providers: [CartService]
})
export class RestaurantDetailsPageModule {}
