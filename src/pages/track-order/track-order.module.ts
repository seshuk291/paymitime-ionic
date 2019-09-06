import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { TrackOrderPage } from "./track-order";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [TrackOrderPage],
  imports: [IonicPageModule.forChild(TrackOrderPage), TranslateModule]
})
export class TrackOrderPageModule {}
