import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ConfirmOrderPage } from "./confirm-order";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [ConfirmOrderPage],
  imports: [IonicPageModule.forChild(ConfirmOrderPage), TranslateModule]
})
export class ConfirmOrderPageModule {}
