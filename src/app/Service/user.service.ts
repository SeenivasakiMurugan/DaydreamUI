import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../Interface/iuser';
import { apiUrls } from '../../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl : string = apiUrls.baseUrl;
  constructor(private _http:HttpClient) { }
  
  AddUpdateUser(_user : User , url : string){
    return this._http.post(this.baseUrl + url , _user);
  }

  Login(url : string){
    return this._http.get(this.baseUrl + url);
  }
}
