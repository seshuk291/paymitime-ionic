import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { SupportPage } from "./support";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [SupportPage],
  imports: [IonicPageModule.forChild(SupportPage), TranslateModule]
})
export class SupportPageModule {}
