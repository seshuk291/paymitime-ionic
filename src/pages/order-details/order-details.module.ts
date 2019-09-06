import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { OrderDetailsPage } from "./order-details";
import { TranslateModule } from "@ngx-translate/core";
import { Ionic2RatingModule } from "ionic2-rating";

@NgModule({
  declarations: [OrderDetailsPage],
  imports: [
    IonicPageModule.forChild(OrderDetailsPage),
    TranslateModule,
    Ionic2RatingModule
  ]
})
export class OrderDetailsPageModule {}
