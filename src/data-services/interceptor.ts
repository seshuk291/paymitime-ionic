import { Injectable, Injector } from '@angular/core';
import {  HttpInterceptor } from '@angular/common/http';
import { LoginService } from '../pages/login/login.service';
// import { AuthserviceService } from '../services/authservice.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  /*
      This will add Authorization token to every request
  */

  auth;
  constructor(inj: Injector) {
    setTimeout(() => {
      this.auth = inj.get(LoginService);
    });
  }


  intercept(req, next) {

      // exclude url's that we dont want to include auth header
      const excludedUrl = [
        'http://localhost:1337/auth/local',
        'http://0.0.0.0:1337/auth/local',
        'https://sleepy-headland-26492.herokuapp.com/auth/local',
        'https://sleepy-headland-26492.herokuapp.com/auth/local/register'
      ];

      if (excludedUrl.some(url => url === req.url)) {
        return next.handle(req);
      }

      // get the token from the local storage and add it to the auth header
      const authHeader = localStorage.getItem('jwtToken');
      const authReq = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + authHeader)});
      return next.handle(authReq);

    }

}
