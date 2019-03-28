import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { UploadService } from '../services/upload.service';
import { Artist } from '../models/artist';

@Component({
  selector: 'artist-edit',
  templateUrl: '../views/artist-add.html',
  providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit {
  public title: string;
  public artist: Artist;
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
    private _artistService: ArtistService,
    private _uploadService: UploadService
  ) {
    this.title = 'Update new artist'
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist('', '', '');
    this.is_edit = true;
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
            console.log("ala mierdad")
            this._router.navigate(['/']);
          } else {
            this.artist = response.artist;
            console.log('ARTIST!!!!')
            console.log(this.artist)
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

  onSubmit() {
    console.log(this.artist);
    this._route.params.forEach((param: Params) => {
      let id = param['id'];

      this._artistService.editArtist(this.token, id, this.artist).subscribe(
        response => {
          if (!response.artist) {
            alert('Error!!!');
            this.alertMsj = 'Error, something went wrong'
          } else {
            console.log('ARTIST CREATED')
            // this.artist = response.artist;
            console.log(this.artist)
            this.alertMsj = 'Artist has been updated successfully!';
            // Upload Image

            this._uploadService.makeFileRequest(this.url + 'upload-image-artist/' + id, [], this.filesToUpload, this.token, 'image')
              .then(
                result => {
                  this._router.navigate(['/artists', 1]);
                },
                error => {
                  console.log('ERROR IN UPLOAD IMAGE');
                  console.log(error);
                }
              );
            // this._router.navigate(['./edit-artist'], response.artist._id);

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
