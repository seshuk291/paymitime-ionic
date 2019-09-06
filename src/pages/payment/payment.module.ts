import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { PaymentPage } from "./payment";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [PaymentPage],
  imports: [IonicPageModule.forChild(PaymentPage), TranslateModule]
})
export class PaymentPageModule {}
