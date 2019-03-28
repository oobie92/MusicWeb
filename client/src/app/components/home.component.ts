import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';

@Component({
  selector: 'home',
  templateUrl: '../views/home.html'
})

export class HomeComponent implements OnInit {
  public title: string;
  public identity;
  public token;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ){
    this.title = 'Artists';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(){
    console.log('home component.ts loaded')

    // List of artists
  }

}
