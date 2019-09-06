import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { OrdersPage } from "./orders";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [OrdersPage],
  imports: [IonicPageModule.forChild(OrdersPage), TranslateModule]
})
export class OrdersPageModule {}
