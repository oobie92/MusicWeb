import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from './global';
import { HttpClient, HttpHeaders } from '@angular/common/http';


// npm i rxjs-compat -P


@Injectable()
export class UserService{
  public identity;
  public token;
  public url: string;

  constructor(private _http: HttpClient){
    this.url = GLOBAL.url;
  }

  signUp(userToLogin, getHash = null): Observable<any>{
    if (getHash != null) userToLogin.getHash = getHash;

    let json: {} = JSON.stringify(userToLogin);
    let params = json;

    // let headers = new Headers({'Content-Type': 'application/json'});
    let headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this._http.post(this.url+'login',params, {headers: headers})
                      .pipe(map(res => {return res}));
  }

  register(userToRegister): Observable<any>{
    let params: {} = JSON.stringify(userToRegister);

    // let headers = new Headers({'Content-Type': 'application/json'});
    let headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this._http.post(this.url+'register',params, {headers: headers})
                      .pipe(map(res => {return res}));
  }

  updateUser(userToUpdate){
    let params: {} = JSON.stringify(userToUpdate);

    let headers = new HttpHeaders({'Content-Type': 'application/json',
                                  'Authorization': this.getToken()});

    return this._http.put(this.url+'update-user/'+userToUpdate._id,params, {headers})
                      .pipe(map(res => {return res}));
  }

  getIdentity(){
    let identity = JSON.parse(localStorage.getItem('identity'));

    if(identity != "undefined") {
      this.identity = identity;
    } else {
      this.identity = null;
    }

    return this.identity;
  }

  getToken(){
    let token = localStorage.getItem('token');

    if(token != "undefined") {
      this.token = token;
    } else {
      this.token = null;
    }

    return this.token;
  }
}