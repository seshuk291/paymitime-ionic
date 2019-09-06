import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ChatListPage } from "./chat-list";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [ChatListPage],
  imports: [IonicPageModule.forChild(ChatListPage), TranslateModule]
})
export class ChatListPageModule {}
