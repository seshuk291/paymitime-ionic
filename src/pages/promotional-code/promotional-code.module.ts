import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { PromotionalCodePage } from "./promotional-code";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [PromotionalCodePage],
  imports: [IonicPageModule.forChild(PromotionalCodePage), TranslateModule]
})
export class PromotionalCodePageModule {}
