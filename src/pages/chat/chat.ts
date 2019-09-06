import { Component, ViewChild } from "@angular/core";
import { Content } from "ionic-angular/index";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from "ionic-angular";
import { ChatService } from "./chat.service";
import { SocketService } from "../../providers/socket-service";

@IonicPage()
@Component({
  selector: "page-chat",
  templateUrl: "chat.html",
  providers: [ChatService, SocketService]
})
export class ChatPage {
  @ViewChild(Content) content: Content;
  public restId: any;
  public chatData: any = {
    message: "",
    receiverRole: "Manager",
    receiver: ""
  };
  public participantsInfo: any = {};
  public chatList: any[] = [];
  public pageNo = 0;
  private loader;
  public nextPage: number;
  public url = "assets/imgs/s1.jpg";
  public constactPerson: any;
  public restaurantName: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public chatService: ChatService,
    public socketService: SocketService,
    private loadingCtrl: LoadingController
  ) {
    this.restId = this.navParams.get("restId");
    this.constactPerson = this.navParams.get("managerId");
    this.getRestaurantDetail(this.restId);
    this.chatData.receiver = this.constactPerson;
  }

  ionViewDidLoad() {
    this.getUserInfo();
  }

  //Used for get Restaurant by its id
  getRestaurantDetail(id) {
    this.loader = this.loadingCtrl.create({
      content: "Please wait.."
    });
    this.loader.present();
    this.chatService.getResturant(id).subscribe(
      (res: any) => {
        this.participantsInfo.restaurantName = res.restaurantID.restaurantName;
        this.participantsInfo.locationName = res.locationName;
        if (res.restaurantID.logo != null) {
          this.participantsInfo.logo = res.restaurantID.logo;
        } else {
          this.participantsInfo.logo = this.url;
        }
        this.getAllConversations(this.constactPerson);
        this.loader.dismiss();
      },
      error => {
        this.loader.dismiss();
      }
    );
  }

  //Used for get all Chat history
  getAllConversations(id) {
    this.chatService.getResturantMessage(id, this.pageNo).subscribe(
      (res: any) => {
        this.restaurantName = res.sender.restaurantName;

        if (res.messages.length > 0) {
          this.chatList = res.messages;
          this.scrollToBottom();
        }
        this.loader.dismiss();
      },
      error => {
        this.loader.dismiss();
      }
    );
  }

  //Used for get User Information
  getUserInfo() {
    this.chatService.getUser().subscribe(
      (res: any) => {
        this.participantsInfo.userName = res.name;
        this.participantsInfo.userLogo = res.logo;
        this.getLastMessage(res._id);
      },
      error => {
        //no content
      }
    );
  }

  //Used for send a message
  onSend() {
    this.chatService.sendMessage(this.chatData).subscribe((response: any) => {
      this.chatList.push(response);
      this.chatData.message = "";
      this.scrollToBottom();
    });
  }

  //Used for get Last message of the user by its id
  getLastMessage(userId) {
    this.socketService.getLastMessage(userId).subscribe((message: any) => {
      let lastMesage: any = message;
      if (this.chatData.receiver == lastMesage.sender) {
        this.chatList.push(message);
      }
      if (this.chatList.length > 8) {
        this.scrollToBottom();
      }
    });
  }

  //Used for Show scroll bar to bottom postion
  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    });
  }
}
