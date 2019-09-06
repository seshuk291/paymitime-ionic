import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { TermsPage } from "./terms";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [TermsPage],
  imports: [IonicPageModule.forChild(TermsPage), TranslateModule]
})
export class TermsPageModule {}
