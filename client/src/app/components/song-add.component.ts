import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';

import { Song } from '../models/song';

@Component({
  selector: 'song-add',
  templateUrl: '../views/song-add.html',
  providers: [UserService, AlbumService, SongService]
})

export class SongAddComponent implements OnInit {
  public _title: string;
  public song: Song;
  public _name: string;
  public identity;
  public token;
  public url: string;
  public alertMsj;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _albumService: AlbumService,
    private _songService: SongService
  ) {
    this._title = 'Create new song'
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.song = new Song(null, '', '' , '', '');
  }

  ngOnInit() {
    console.log('SongAddComponent add component.ts loaded');

    // get album's detail
    this.getAlbum();
  }

  onSubmit() {
    this._route.params.forEach((params: Params) => {
      this.song.album = params['album'];
      console.log(params);
      console.log(this.song);

      this._songService.addSong(this.token, this.song).subscribe(
        response => {
          if (!response.song) {
            alert('Error!!!');
            this.alertMsj = 'Error, something went wrong'
          } else {
            console.log('song CREATED')
            this.song = response.song;
            this.alertMsj = 'Song created successfully!'
            this._router.navigate(['./edit-song', response.song._id]);
          }
        },
        error => {
          let err = <any>error;
          this.alertMsj = err.error.message;
          if (this.alertMsj != null) console.log(this.alertMsj)
        }
      );

    });
  }

  getAlbum() {
    this._route.params.forEach((param: Params) => {
      let id = param['album'];
      
      this._albumService.getAlbum(this.token, id).subscribe(
        response => {
          
          
          if (!response.album) {
            console.log("No album found!!")
          } else {
            this._name = response.album.title;
          }
        },
        error => {
          let err = <any>error;
          this.alertMsj = err.error.message;
          if(this.alertMsj != null) console.log(this.alertMsj)
        }
      );
    });
  }
}