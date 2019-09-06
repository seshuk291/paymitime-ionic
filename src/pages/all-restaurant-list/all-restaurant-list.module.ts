import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { AllRestaurantPage } from "./all-restaurant-list";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [AllRestaurantPage],
  imports: [IonicPageModule.forChild(AllRestaurantPage), TranslateModule]
})
export class AllProductsPageModule {}
