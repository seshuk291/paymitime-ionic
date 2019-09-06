import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { HttpClientModule, HttpClient } from "@angular/common/http";

import { MyApp } from "./app.component";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { ConstantService } from "./constant.service";
import { UserService } from "../providers/user-service";
import { SocketService } from "../providers/socket-service";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
// import { BackgroundMode } from '@ionic-native/background-mode';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    ConstantService,
    SplashScreen,
    UserService,
    SocketService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BarcodeScanner,
    // BackgroundMode
  ],
  exports: [TranslateModule]
})
export class AppModule {}
