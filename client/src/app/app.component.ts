import { Component, OnInit } from '@angular/core';

import { User } from './models/user';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit {
  public title = 'Music Web';
  public user: User;
  public alertRegister;
  public userRegister: User;
  public identity;
  public token;
  public errMsj;
  public url:string;

  constructor(
    private _userService: UserService
  ){
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.userRegister = new User('', '', '', '', '', 'ROLE_USER', '');
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    console.log(this.identity);
    console.log(this.token);
  }


  public onSubmit(){
    console.log(this.user);

    this._userService.signUp(this.user).subscribe(
      response => {
        console.log(response);
        let identity = response.user;
        this.identity = identity;

        if(!this.identity._id){
          alert("User is not sign up")
        } else {
          // Create in localstorage
          localStorage.setItem('identity', JSON.stringify(identity));

          // Get token to send to any request
          this._userService.signUp(this.user, true).subscribe(
            response => {
              // console.log("TOKEN:");
              // console.log(response);
              let token = response.token;
              this.token = token;
      
              if(this.token.length <= 0){
                alert("Token is not correct!")
              } else {
                // Create in localstorage
                localStorage.setItem('token', token);
                this.user = new User('', '', '', '', '', 'ROLE_USER', '');
              }
            },
            error => {
              let err = <any>error;
              this.errMsj = err.error.message;
              if(this.errMsj != null) console.log(this.errMsj)
            }
          );

        }
      },
      error => {
        let err = <any>error;
        this.errMsj = err.error.message;
        if(this.errMsj != null) console.log(this.errMsj)
      }
    );
  }

  logOut(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    this.identity = "";
    this.token = "";
  }

  onSubmitRegister(){
    console.log(this.userRegister);

    this._userService.register(this.userRegister).subscribe(
      response => {
        console.log(response);
        let { user } = response;
        this.userRegister = <any>user;

        if(!user._id){
          this.alertRegister = 'Could not register';
        } else {
          this.alertRegister = 'Resgiter successfully, Log in with '+ this.userRegister.email;
          this.userRegister = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      },
      error => {
        let err = <any>error;
        this.alertRegister = err.error.message;
        if(this.alertRegister != null) console.log(this.alertRegister)
      }
    )
  }

}
