import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { FavouritesPage } from "./favourites";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [FavouritesPage],
  imports: [IonicPageModule.forChild(FavouritesPage), TranslateModule]
})
export class FavoritesPageModule {}
