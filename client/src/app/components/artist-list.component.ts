import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';

@Component({
  selector: 'artist-list',
  templateUrl: '../views/artist-list.html',
  providers: [UserService, ArtistService]
})

export class ArtistListComponent implements OnInit {
  public title: string;
  public artist: Artist[];
  public identity;
  public token;
  public url: string;
  public next_page;
  public prev_page;
  public _confirm;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService
  ) {
    this.title = 'Artists'
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.next_page = 1;
    this.prev_page = 1;
  }

  ngOnInit() {
    console.log('Artist list component.ts loaded')

    // List of artists
    this.getArtists();
  }

  getArtists() {
    this._route.params.forEach((params: Params) => {
      let page = +params['page'];

      if (!page) {
        page = 1;
      } else {
        this.next_page = page + 1;
        this.prev_page = page - 1;

        if (this.prev_page == 0) {
          this.prev_page = 1;
        }
      }

      this._artistService.getArtists(this.token, page).subscribe(
        response => {

          if (!response.artist) {
            this._router.navigate(['/']);
          } else {
            this.artist = response.artist;
            console.log(this.artist)
          }
        },
        error => {

          let err = <any>error;
          // this.alertMsj = err.error.message;
          if(err != null) console.log(err)
        }
      );
    });
  }

  onDeleteConfirm(id){
    this._confirm = id;

  }

  onCancelArtist(){
    this._confirm = null;
  }

  onDeleteArtist(id){
    this._artistService.deleteArtist(this.token, id).subscribe(
      response => {
        if (!response.artist) {
          // this._router.navigate(['/']);
          alert('Error on deleting')
        } else {
          this.getArtists();
        }
      },
      error => {

        let err = <any>error;
        // this.alertMsj = err.error.message;
        if(err != null) console.log(err)
      }
    );
  }

}
