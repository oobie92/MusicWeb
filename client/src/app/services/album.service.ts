import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';

import { GLOBAL } from './global';
import { Album } from '../models/album';


// npm i rxjs-compat -P


@Injectable()
export class AlbumService {
  public url: string;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  getAlbums(token, artistId = null) {
    let headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });

    let opts = new RequestOptions({ headers });

    if(artistId == null) {
      return this._http.get(this.url + 'albums/', opts)
      .pipe(map(res => { return res.json() }));
    }

    return this._http.get(this.url + 'albums/' + artistId, opts)
      .pipe(map(res => { return res.json() }));
  }

  getAlbum(token, id: string) {
    let headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });

    let opts = new RequestOptions({ headers });

    return this._http.get(this.url + 'album/' + id, opts)
      .pipe(map(res => { return res.json() }));
  }

  addAlbum(token, album: Album): Observable<any> {
    let params = JSON.stringify(album);
    let headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });

    return this._http.post(this.url + 'album', params, { headers })
      .pipe(map(res => { return res.json() }));
  }

  editAlbum(token, id: string, album: Album): Observable<any> {
    let params = JSON.stringify(album);
    let headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });

    return this._http.put(this.url + 'album/' + id, params, { headers })
      .pipe(map(res => { return res.json() }));
  }

  deleteAlbum(token, id: string) {
    let headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });

    let opts = new RequestOptions({ headers });

    return this._http.delete(this.url + 'album/' + id, opts)
      .pipe(map(res => { return res.json() }));
  }


}