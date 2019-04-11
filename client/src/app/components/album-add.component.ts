import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
  selector: 'album-add',
  templateUrl: '../views/album-add.html',
  providers: [UserService, ArtistService, AlbumService]
})

export class AlbumAddComponent implements OnInit {
  public _title: string;
  public artist: Artist;
  public album: Album;
  public identity;
  public token;
  public url: string;
  public alertMsj;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService,
    private _albumService: AlbumService
  ) {
    this._title = 'Create new album'
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.album = new Album('', '', 2017, '', '');
  }

  ngOnInit() {
    console.log('AlbumAlbumAddComponent add component.ts loaded');
    console.log(this._title)
    // Call method api's to get an artist by its id
  }

  onSubmit() {
    this._route.params.forEach((params: Params) => {
      this.album.artist = params['artist'];
      console.log(params);

      this._albumService.addAlbum(this.token, this.album).subscribe(
        response => {

          if (!response.album) {
            alert('Error!!!');
            this.alertMsj = 'Error, something went wrong'
          } else {
            console.log('album CREATED')
            this.album = response.album;
            this.alertMsj = 'Album created successfully!'
            this._router.navigate(['./edit-album', response.album._id]);

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
}