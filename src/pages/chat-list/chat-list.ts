import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from "ionic-angular";
import { ChatService } from "../chat/chat.service";

@IonicPage()
@Component({
  selector: "page-chat-list",
  templateUrl: "chat-list.html",
  providers: [ChatService]
})
export class ChatListPage {
  public chatList: any[] = [];
  public notice: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public chatService: ChatService,
    private loadingCtrl: LoadingController
  ) {
    this.getAllChatList();
  }

  //Used for all chat list
  getAllChatList() {
    const loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.chatService.getAllManagerChatList().subscribe(
      (res: any) => {
        if (res.message) {
          this.notice = res.message;
        } else {
          this.chatList = res;
        }
        loader.dismiss();
      },
      error => {
        loader.dismiss();
      }
    );
  }

  // Go To chatPage and chat with the Restaurant
  gotoChat(id, locId) {
    this.navCtrl.push("ChatPage", {
      managerId: id,
      restId: locId
    });
  }
}
