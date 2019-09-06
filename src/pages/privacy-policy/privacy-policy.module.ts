import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { PrivacyPolicyPage } from "./privacy-policy";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [PrivacyPolicyPage],
  imports: [IonicPageModule.forChild(PrivacyPolicyPage), TranslateModule]
})
export class PrivacyPolicyPageModule {}
