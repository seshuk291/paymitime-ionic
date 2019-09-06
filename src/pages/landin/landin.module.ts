import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { LandinPage } from "./landin";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [LandinPage],
  imports: [IonicPageModule.forChild(LandinPage), TranslateModule]
})
export class LandinPageModule {}
