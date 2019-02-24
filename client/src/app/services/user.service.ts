import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from './global';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// .pipe(map(res => res.json()))

// npm i rxjs-compat -P


@Injectable()
export class UserService{
  public url: string;
  // public headers: any;

  constructor(private _http: HttpClient){

    this.url = GLOBAL.url;
    // this.headers = new Headers({'Content-Type': 'application/json'});
    // console.log(this.url)
  }

  signUp(userToLogin, getHash = null): Observable<any>{
    if (getHash != null) userToLogin.getHash = getHash;

    let json: {} = JSON.stringify(userToLogin);
    let params = json;

    // let headers = new Headers({'Content-Type': 'application/json'});
    let headers = new HttpHeaders({'Content-Type': 'application/json'});

      // console.log(this.headers);
    return this._http.post(this.url+'login',params, {headers: headers})
                      .pipe(map(res => {
                        console.log('ESTA ES LA RESPUESTA: '+res)
                        return res
                      }));
  }
}