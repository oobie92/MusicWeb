import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';

import { GLOBAL } from './global';
import { Artist } from '../models/artist';


// npm i rxjs-compat -P


@Injectable()
export class ArtistService {
  public url: string;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  getArtists(token, page) {
    let headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });

    let opts = new RequestOptions({ headers });

    return this._http.get(this.url + 'artists/' + page, opts)
      .pipe(map(res => { return res.json() }));
  }

  getArtist(token, id: string) {
    let headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });

    let opts = new RequestOptions({ headers });

    return this._http.get(this.url + 'artist/' + id, opts)
      .pipe(map(res => { return res.json() }));
  }

  addArtist(token, artist: Artist): Observable<any> {
    let params = JSON.stringify(artist);
    let headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });

    return this._http.post(this.url + 'artist', params, { headers })
      .pipe(map(res => { return res.json() }));
  }

  editArtist(token, id: string, artist: Artist): Observable<any> {
    let params = JSON.stringify(artist);
    let headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });

    return this._http.put(this.url + 'artists/' + id, params, { headers })
      .pipe(map(res => { return res.json() }));
  }

  deleteArtist(token, id: string) {
    let headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });

    let opts = new RequestOptions({ headers });

    return this._http.delete(this.url + 'artist/' + id, opts)
      .pipe(map(res => { return res.json() }));
  }

}