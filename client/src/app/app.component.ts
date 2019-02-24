import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit {
  public title = 'Music Web';
  public user: User;
  public identity;
  public token;

  constructor(
    private _userService: UserService
  ){
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
  }

  ngOnInit(){
  }

  public onSubmit(){
    console.log(this.user);

    this._userService.signUp(this.user).subscribe(
      response => {
        console.log(response);
      },
      error => {
        const errMsj = <any>error;

        if(errMsj != null) console.log(errMsj)
      }
    );
  }

}
