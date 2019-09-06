import { Component } from "@angular/core";
import { IonicPage, Platform } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: "page-setting",
  templateUrl: "setting.html"
})
export class SettingPage {
  value: any;
  public options = [
    {
      language: "ENGLISH",
      value: "en"
    },
    {
      language: "FRENCH",
      value: "fr"
    },
    {
      language: "ARABIC",
      value: "ar"
    }
  ];
  constructor(public translate: TranslateService, public platform: Platform) {}

  // Change langusge RTL
  changeLanguage() {
    if (this.value == "fr") {
      this.translate.use("fr");
      this.platform.setDir("ltr", true);
    } else if (this.value == "ar") {
      this.platform.setDir("rtl", true);
      this.translate.use("ar");
    } else {
      this.translate.use("en");
      this.platform.setDir("ltr", true);
    }
    localStorage.setItem("language", this.value);
  }
}
