import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';

@Component({
  selector: 'artist-detail',
  templateUrl: '../views/artist-detail.html',
  providers: [UserService, ArtistService]
})

export class ArtistDetailComponent implements OnInit {
  public artist: Artist;
  public identity;
  public token;
  public url: string;
  public alertMsj;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log('Artist add component.ts loaded');

    // Call method api's to get an artist by its id
    this.getArtist();
  }

  getArtist() {
    this._route.params.forEach((param: Params) => {
      let id = param['id'];

      this._artistService.getArtist(this.token, id).subscribe(
        response => {


          if (!response.artist) {
            this._router.navigate(['/']);
          } else {
            this.artist = response.artist;

            // Get Artist's album
          }
        },
        error => {

          let err = <any>error;
          // this.alertMsj = err.error.message;
          // if(this.alertMsj != null) console.log(this.alertMsj)
        }
      );
    });
  }

}