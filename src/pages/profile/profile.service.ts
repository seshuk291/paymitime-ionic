import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConstantService } from '../../app/constant.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ProfileService {
  public token: any;
  currentUser;
  _currentUser = new BehaviorSubject({});
  currentUser$ = this._currentUser.asObservable();

  constructor(
    public http: HttpClient,
    public constantService: ConstantService
  ) {
    this.token = localStorage.getItem('jwtToken');

    this.currentUser$.subscribe(user => {
      console.log("Observale user", user);
      this.currentUser = user;
    });
  }


  // API call to get user detail
  getUserDetails() {
    return this.http.get(this.constantService.testApi + 'users/me');
  }

  // API call to update user detail
  UpdateUserProfile(address: any, userId: any) {
    const body = address;
    return this.http.put(
      this.constantService.testApi + 'users/' + userId,
      body
    );
  }
}
