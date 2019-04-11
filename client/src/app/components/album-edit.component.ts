import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
  selector: 'album-edit',
  templateUrl: '../views/album-add.html',
  providers: [UserService, AlbumService, UploadService]
})

export class AlbumEditComponent implements OnInit {
  public _title: string;
  public artist: Artist;
  public album: Album;
  public identity;
  public token;
  public url: string;
  public alertMsj;
  public is_edit;
  public filesToUpload: Array<File>;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _uploadService: UploadService,
    private _albumService: AlbumService
  ) {
    this._title = 'Create new album'
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.album = new Album('', '', 2017, '', '');
    this.is_edit = true;
  }

  ngOnInit() {
    console.log('AlbumEditComponent add component.ts loaded');
    // get album
    this.getAlbum();
  }

  getAlbum() {
    this._route.params.forEach((params: Params) => {
      let id = params['artist'];

      console.log(params)
      console.log(this.token)


      this._albumService.getAlbum(this.token, id).subscribe(
        response => {

          if (!response.album) {
            alert('Error!!!');
            this.alertMsj = 'Error, something went wrong';
            this._router.navigate(['/']);
          } else {
            console.log('album CREATED')
            this.album = response.album;
          }
        },
        error => {
          let err = <any>error;
          this.alertMsj = err.json().message;
          if (this.alertMsj != null) console.log(this.alertMsj)
        }
      );
    });
  }

  onSubmit() {
    this._route.params.forEach((params: Params) => {
      let id = params['artist'];
      console.log(params);

      this._albumService.editAlbum(this.token, id, this.album).subscribe(
        response => {
          console.log(response)

          if (!response.album) {
            alert('Error!!!');
            this.alertMsj = 'Error, something went wrong'
          } else {
            this.alertMsj = 'Album updated successfully!'
            // Upload image
            if (!this.filesToUpload) {
              this._router.navigate(['/artist', response.album.artist]);
            } else {
              this._uploadService.makeFileRequest(this.url + 'upload-image-album/' + id,
              [], this.filesToUpload, this.token, 'image')
              .then(
                result => {
                  this._router.navigate(['/artist', response.album.artist]);
                },
                error => {
                  console.log('ERROR IN UPLOAD IMAGE');
                  console.log(error);
                }
              );
            }
  

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

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

}