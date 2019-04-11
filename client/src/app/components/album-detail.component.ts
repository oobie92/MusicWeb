import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';

@Component({
  selector: 'album-detail',
  templateUrl: '../views/album-detail.html',
  providers: [UserService, AlbumService]
})

export class AlbumDetailComponent implements OnInit {
  public album: Album;
  public identity;
  public token;
  public url: string;
  public alertMsj;
  public confirm;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _albumService: AlbumService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log('Album details component.ts loaded');

    // get album's details
    this.getAlbum();
  }

  getAlbum() {
    this._route.params.forEach((param: Params) => {
      let id = param['id'];

      
      this._albumService.getAlbum(this.token, id).subscribe(
        response => {
          
          
          if (!response.album) {
            this._router.navigate(['/']);
          } else {
            this.album = response.album;
            console.log(this.album)

            // Get Artist's album
            // this._albumService.getAlbums(this.token, response.artist._id).subscribe(
            //   response => {
            //     if(!response.albums){
            //       this.alertMsj = "Not albums";
            //     } else {
            //       this.albums = response.albums;
            //     }
            //     // this.alertMsj = err.error.message;
            //     // if(this.alertMsj != null) console.log(this.alertMsj)
            //   },
            //   error => {

            //     let err = <any>error;
            //     // this.alertMsj = err.error.message;
            //     // if(this.alertMsj != null) console.log(this.alertMsj)
            //   }
            // );
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