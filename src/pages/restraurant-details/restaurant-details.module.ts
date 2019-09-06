import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { RestaurantDetailsPage } from "./restaurant-details";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [RestaurantDetailsPage],
  imports: [IonicPageModule.forChild(RestaurantDetailsPage), TranslateModule]
})
export class RestaurantDetailsPageModule {}
