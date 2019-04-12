import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { SongService } from '../services/song.service';

import { Song } from '../models/song';

@Component({
  selector: 'song-edit',
  templateUrl: '../views/song-add.html',
  providers: [UserService, SongService, UploadService]
})

export class SongEditComponent implements OnInit {
  public _title: string;
  public song: Song;
  public identity;
  public token;
  public url: string;
  public alertMsj;
  public is_edit;
  public filesToUpload;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _songService: SongService,
    private _uploadService: UploadService
  ) {
    this._title = 'Edit song'
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.song = new Song(null, '', '', '', '');
    this.is_edit = true;
  }

  ngOnInit() {
    console.log('SongEditComponent add component.ts loaded');

    // get song to edit
    this.getSong();
  }

  getSong(){
    this._route.params.forEach((params: Params) => {
      let id = params['id'];

      this._songService.getSong(this.token, id).subscribe(
        response => {
          if (!response.song) {
            alert('Error!!!');
            this.alertMsj = 'Error, something went wrong'
          } else {
            console.log('Song updated')
            this.song = response.song;
            // this.alertMsj = 'Song updated successfully!';
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

  onSubmit() {
    this._route.params.forEach((params: Params) => {
      let id = params['id'];

      this._songService.editSong(this.token, id, this.song).subscribe(
        response => {
          if (!response.song) {
            alert('Error!!!');
            this.alertMsj = 'Error, something went wrong'
          } else {
            console.log('Song updated')
            this.song = response.song;
            this.alertMsj = 'Song updated successfully!';

            // upload file
            if (!this.filesToUpload) {
              this._router.navigate(['/album', response.song.album]);
            } else {
              this._uploadService.makeFileRequest(this.url + 'upload-file-song/' + id,
                [], this.filesToUpload, this.token, 'file')
                .then(
                  result => {
                    this._router.navigate(['/album', response.song.album]);
                  },
                  error => {
                    console.log('ERROR IN UPLOAD IMAGE');
                    console.log(error);
                  }
                );
            }

            // this._router.navigate(['./edit-song', response.song._id]);
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