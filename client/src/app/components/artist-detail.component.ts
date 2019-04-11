import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
  selector: 'artist-detail',
  templateUrl: '../views/artist-detail.html',
  providers: [UserService, ArtistService, AlbumService]
})

export class ArtistDetailComponent implements OnInit {
  public artist: Artist;
  public albums: Album[];
  public identity;
  public token;
  public url: string;
  public alertMsj;
  public confirm;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _albumService: AlbumService,
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
            this._albumService.getAlbums(this.token, response.artist._id).subscribe(
              response => {
                if(!response.albums){
                  this.alertMsj = "Not albums";
                } else {
                  this.albums = response.albums;
                }
                // this.alertMsj = err.error.message;
                // if(this.alertMsj != null) console.log(this.alertMsj)
              },
              error => {

                let err = <any>error;
                // this.alertMsj = err.error.message;
                // if(this.alertMsj != null) console.log(this.alertMsj)
              }
            );
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

  onDeleteConfirm(id){
    this.confirm = id;
  }

  onCancelAlbum(){
    this.confirm = null;
  }

  onDeleteAlbum(id){
    this._albumService.deleteAlbum(this.token, id).subscribe(
      response => {
        if(!response.album){
          alert('Error in server');
        }

        this.getArtist();
      },
      error => {

        let err = <any>error;
      }
    );
  }

}