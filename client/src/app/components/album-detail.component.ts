import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { Album } from '../models/album';
import { Song } from '../models/song';

@Component({
  selector: 'album-detail',
  templateUrl: '../views/album-detail.html',
  providers: [UserService, AlbumService, SongService]
})

export class AlbumDetailComponent implements OnInit {
  public album: Album;
  public songs: Song[];
  public identity;
  public token;
  public url: string;
  public alertMsj;
  public confirm;
  public _confirm;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _albumService: AlbumService,
    private _songService: SongService
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
            this._songService.getSongs(this.token, response.album._id).subscribe(
              response => {
                if(!response.songs){
                  this.alertMsj = "No song for this album";
                } else {
                  this.songs = response.songs;
                  console.log(this.songs);
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
    this._confirm = id;

  }

  onCancelSong(){
    this._confirm = null;
  }

  onDeleteSong(id){
    this._songService.deleteSong(this.token, id).subscribe(
      response => {
        if (!response.song) {
          // this._router.navigate(['/']);
          alert('Error on deleting')
        } else {
          this.getAlbum();
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