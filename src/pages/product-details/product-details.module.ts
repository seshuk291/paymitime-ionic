import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ProductDetailsPage } from "./product-details";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [ProductDetailsPage],
  imports: [IonicPageModule.forChild(ProductDetailsPage), TranslateModule]
})
export class ProductDetailsPageModule {}
