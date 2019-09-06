import { StyledMap } from "./styled-map.directive";
import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { LocationChangerPage } from "./location-changer";
import { AgmCoreModule } from "@agm/core";
import { TranslateModule } from "@ngx-translate/core";
import { DirectionsMapDirective } from "./direction.directive";

@NgModule({
  declarations: [LocationChangerPage, StyledMap, DirectionsMapDirective],
  imports: [
    IonicPageModule.forChild(LocationChangerPage),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBQr_6wlXZS7bJQuwtLYAbvE1IsDiF9Ov0",
      libraries: ["places"]
    }),
    TranslateModule
  ]
})
export class LocationChangerPageModule {}
