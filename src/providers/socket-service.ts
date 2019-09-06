import { Injectable, NgZone } from "@angular/core";
import * as io from "socket.io-client";
import { Observable } from "rxjs/Observable";
import { ConstantService } from "../app/constant.service";
//import {ConstService} from './const-service';
import { UserService } from "./user-service";

@Injectable()
export class SocketService {
  socket: any;
  zone: any;
  clientInfo = {
    userId: ""
  };

  constructor(
    public constService: ConstantService,
    public userService: UserService
  ) {
    this.socket = io.connect(this.constService.Socket_Url);
    this.zone = new NgZone({ enableLongStackTrace: false });

    this.socket.on("connect", function () {
      console.log("connected");
    });
    this.socket.on("disconnect", function () {
      console.log("disconnected");
    });

    this.socket.on("error", function (e) {
      console.log("System", e ? e : "A unknown error occurred");
    });
  }

  establishConnection() {
    // this.socket = io.connect(this.constService.Socket_Url);
    // this.zone = new NgZone({enableLongStackTrace: false});

    // this.socket.on('connect', function () {
    //     console.log('connected');
    // });
    // this.socket.on('disconnect', function () {
    //     console.log('disconnected');
    // });

    // this.socket.on('error', function (e) {
    //     console.log('System', e ? e : 'A unknown error occurred');
    // });

    this.userService.getUser().subscribe(
      (Response: any) => {
        this.clientInfo.userId = Response._id;
        console.log("user Id" + Response._id);
        this.socket.emit("storeClientInfo", this.clientInfo);
      },
      error => {
        console.error(error);
        localStorage.removeItem("token");
      }
    );
  }

  emitMessage(messageBody) {
    this.socket.emit("user_message", {
      message: messageBody.message,
      user_id: messageBody.sellerId
    });
  }

  getLastMessage(id) {
    console.log("cliendt info userId" + id);
    let observable = new Observable(observer => {
      this.socket.on("message" + id, data => {
        observer.next(data);
      });
    });
    return observable;
  }
}
