import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';

import { GLOBAL } from './global';
import { Album } from '../models/album';
import { Song } from '../models/song';


// npm i rxjs-compat -P


@Injectable()
export class SongService {
  public url: string;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  getSong(token, id: string) {
    let headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });
    let opts = new RequestOptions({ headers });

    return this._http.get(this.url + 'song/' + id, opts)
      .pipe(map(res => { return res.json() }));
  }

  getSongs(token, albumId: string) {
    let headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });
    let opts = new RequestOptions({ headers });

    if (albumId == null) {
      return this._http.get(this.url + 'songs/', opts)
        .pipe(map(res => { return res.json() }));
    } else {
      return this._http.get(this.url + 'songs/' + albumId, opts)
        .pipe(map(res => { return res.json() }));
    }
  }

  addSong(token, song: Song): Observable<any> {
    let params = JSON.stringify(song);
    let headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });

    return this._http.post(this.url + 'song', params, { headers })
      .pipe(map(res => { return res.json() }));
  }

  editSong(token, id: string, song: Song): Observable<any> {
    let params = JSON.stringify(song);
    let headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });

    return this._http.put(this.url + 'song/' + id, params, { headers })
      .pipe(map(res => { return res.json() }));
  }

  deleteSong(token, id: string) {
    let headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });

    let opts = new RequestOptions({ headers });

    return this._http.delete(this.url + 'song/' + id, opts)
      .pipe(map(res => { return res.json() }));
  }


}