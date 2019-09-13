import { Injectable } from "@angular/core";
// import {Http, Response, Headers} from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { ConstantService } from "../../app/constant.service";

@Injectable()
export class RegisterService {
  constructor(
    public http: HttpClient,
    public constantService: ConstantService
  ) {}

  // API call to save registration message
  registerData(register: any) {
    const body = register;
    return this.http.post(this.constantService.testApi + "auth/local/register", body);
  }
}
