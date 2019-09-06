import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ProfilePage } from "./profile";
import { FileUploadModule } from "ng2-file-upload";
import { Ng2CloudinaryModule } from "ng2-cloudinary";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [ProfilePage],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    FileUploadModule,
    Ng2CloudinaryModule,
    TranslateModule
  ]
})
export class ProfilePageModule {}
