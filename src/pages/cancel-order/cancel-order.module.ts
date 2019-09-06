import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { CancelOrderPage } from "./cancel-order";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [CancelOrderPage],
  imports: [IonicPageModule.forChild(CancelOrderPage), TranslateModule]
})
export class CancelOrderPageModule {}
