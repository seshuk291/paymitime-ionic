import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ThankyouPage } from "./thankyou";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [ThankyouPage],
  imports: [IonicPageModule.forChild(ThankyouPage), TranslateModule]
})
export class ThankyouPageModule {}
