import { Component,OnInit } from '@angular/core';

import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { GLOBAL } from '../services/global';

@Component({
  selector: 'user-edit',
  templateUrl: '../views/user-edit.html',
  providers: [UserService]
})

export class UserEditComponent implements OnInit{
  public title: string;
  public user:User;
  public identity;
  public token;
  public alertUpdate;
  public filesToUpload: Array<File>;
  public url:string;

  constructor(
    private _userService: UserService
  ){
    this.title = 'Update my info';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
    this.url = GLOBAL.url;
  }

  ngOnInit(){

    console.log('user-edit.component.ts loaded');
  }

  onSubmit(){
    console.log(this.user);

    this._userService.updateUser(this.user).subscribe(
      response => {
        let res = <any>response;
        if (!res.user) {
          this.alertUpdate = 'User not updated';
        } else {
          localStorage.setItem('identity', JSON.stringify(this.user));
          document.getElementById('identity_name').innerHTML = this.user.name;

          if (!this.filesToUpload) {
            // Redirect
          } else {
            this.makeFileRequest(this.url+'upload-image-user/'+this.user._id, [], this.filesToUpload)
                .then(
                  (result: any) => {

                    this.user.image = result.image;
                    localStorage.setItem('identity', JSON.stringify(this.user));

                    let image_path = this.url+'get-image-user/'+this.user.image;
                    document.getElementById('image-logged').setAttribute('src', image_path);
                  }
                );
          }

          this.alertUpdate = 'User has been updated';
        }
      },
      error => {
        let err = <any>error;
        this.alertUpdate = err.error.message;
        if(this.alertUpdate != null) console.log(this.alertUpdate)
      });
  }



  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>){
    const token = this.token;

    return new Promise(function(resolve, reject){
      let formData:any = new FormData();
      const xhr = new XMLHttpRequest();

      for(let i = 0; i < files.length; i++){
        formData.append('image', files[i], files[i].name);
      }

      xhr.onreadystatechange = function(){
        if (xhr.readyState == 4) {
          if (xhr.status == 200){
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response)
          }
        }

      }

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);
    });
  }

}