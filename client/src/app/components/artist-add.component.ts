import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';

@Component({
  selector: 'artist-add',
  templateUrl: '../views/artist-add.html',
  providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit {
  public title: string;
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
  ){
    this.title = 'Create new artist'
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist('', '', '');
  }

  ngOnInit(){
    console.log('Artist add component.ts loaded');

    // List of artists
  }

  onSubmit(){
    console.log(this.artist)
    this._artistService.addArtist(this.token, this.artist).subscribe(
      response => {
        
        if(!response.artist){
          alert('Error!!!');
          this.alertMsj = 'Error, something went wrong'
        } else {
          console.log('ARTIST CREATED')
          this.artist = response.artist;
          console.log(this.artist)
          this.alertMsj = 'Artist has been created successfully!'
          console.log(this.alertMsj)
          // this._router.navigate(['./edit-artist'], response.artist._id);

        }
      },
      error => {
        let err = <any>error;
        this.alertMsj = err.error.message;
        if(this.alertMsj != null) console.log(this.alertMsj)
      }
    );
  }

}
