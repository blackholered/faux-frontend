import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Observable, of, shareReplay} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {User} from '../user';
import {Video} from "../video";
import {CommentObject} from "../commentObject";

@Injectable({providedIn: 'root'})
export class ApiService {
  formError: string = ""; // property to hold the form error message

  private apiUrl = 'http://localhost:8080';  // URL to web api


  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  httpOptionsForm = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + this.getToken()
    })
  };



  @Output() changedLoginState: EventEmitter<any> = new EventEmitter();

  constructor(
    private http: HttpClient) {
  }

  updateLoginStatus(status : boolean) {
    localStorage.setItem('loggedIn', String(status));
    this.changedLoginState.emit(status);
  }

  getLoginStatus() {
    if (localStorage.getItem('loggedIn') == "true") {
      return true;
    }
    return false;
  }


  setToken(user: User, response: LoginResponse) {
    localStorage.setItem('token', String(response.token));
    localStorage.setItem('username', user.username);



    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.getToken()
      })
    };

    this.changedLoginState.emit(user);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUsername() {
    return String(localStorage.getItem('username'));
  }

  signout() {
    localStorage.clear();
    this.updateLoginStatus(false);
  }

  sendVideo(formData: FormData): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl + '/videos/add', formData, this.httpOptionsForm).pipe(
      catchError(this.handleError<boolean>('addVideo'))
    );
  }


  updateVideo(videoDTO : any): Observable<boolean> {

    return this.http.put<boolean>(this.apiUrl + '/videos/update', videoDTO, this.httpOptions).pipe(
      catchError(this.handleError <boolean>('updatevideo'))
    );
  }

  deleteVideo(id: number): Observable<void> {
    const params = new HttpParams().set('id', id.toString());

    const httpOptions = {
      headers: this.httpOptions.headers,
      params: params
    };

    return this.http.delete<void>(this.apiUrl + '/videos/delete', httpOptions).pipe(
      catchError(this.handleError<void>('deleteVideo'))
    );
  }



  sendComment(commentDTO: any): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl + '/comments/add', commentDTO, this.httpOptions).pipe(
      catchError(this.handleError<boolean>('addComment'))
    );
  }

  sendLike(videoDTO: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/likes/add', videoDTO, this.httpOptions).pipe(
      catchError(this.handleError<any>('sendLike'))
    );
  }

  deleteLike(id: number): Observable<void> {
    const params = new HttpParams().set('id', id.toString());

    const httpOptions = {
      headers: this.httpOptions.headers,
      params: params
    };

    return this.http.delete<void>(this.apiUrl + '/likes/delete', httpOptions).pipe(
      catchError(this.handleError<void>('deleteLike'))
    );
  }



  getHasLiked(videoDTO: any): Observable<boolean> {
    const url = `${this.apiUrl}/likes/hasUserLiked`;

    const params = {
      id: videoDTO.id
    };


    return this.http.get<boolean>(url, { params, headers: this.httpOptions.headers }).pipe(
      catchError(this.handleError<boolean>('getHasLiked'))
    );
  }


  checkLoggedStatus(token: string): Observable<boolean> {

    return this.http.post<boolean>(this.apiUrl + '/auth/status', null, this.httpOptions).pipe(
      catchError(this.handleError<boolean>('checkLoggedStatus'))
    );
  }


  addUser(user: User, captchaKey: string): Observable<User> {
    const body = {
      username: user.username,
      password: user.password,
      email: user.email,
      captchaKey: captchaKey
    };
    return this.http.post<User>(this.apiUrl + '/auth/register', body, this.httpOptions).pipe(
      catchError(this.handleError <User>('addUser'))
    );
  }

  login(user: User): Observable<LoginResponse> {
    const data = {
      username: user.username,
      password: user.password
    };
    return this.http.post<LoginResponse>(this.apiUrl + '/auth/login', data).pipe(
      catchError(this.handleError<LoginResponse>('loginUser'))
    );
  }


  getVideoByID(id: number): Observable<Video> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<Video>(this.apiUrl + '/videos/get', {params}).pipe(
      catchError(this.handleError<Video>('getVideoByID'))
    );
  }


  getVideoBySession(id: number): Observable<Video> {
    const body = {
      id: id,
    }
    return this.http.post<Video>(this.apiUrl + '/videos/manage', body, this.httpOptions).pipe(
      catchError(this.handleError<Video>('getVideoBySession'))
    );
  }

  getCommentCountByVideoID(id : number): Observable<SuccessResponse> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<SuccessResponse>(this.apiUrl + '/comments/count', {params}).pipe(
      catchError(this.handleError <SuccessResponse>('getCommentCountByVideoID'))
    );
  }

  getLikeCountByVideoID(id : number): Observable<SuccessResponse> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<SuccessResponse>(this.apiUrl + '/likes/count', {params}).pipe(
      catchError(this.handleError <SuccessResponse>('getLikeCountByVideoID'))
    );
  }


  getCommentByVideoID(id: number, offset: number, limit: number): Observable<CommentObject[]> {
    let params = new HttpParams().set('id', id.toString());
    params = params.append('offset', offset.toString());
    params = params.append('limit', limit.toString());
    return this.http.get<CommentObject[]>(this.apiUrl + '/comments/get', {params}).pipe(
      catchError(this.handleError<CommentObject[]>('getCommentByVideoID'))
    );
  }


  getVideos(page: number, limit: number): Observable<Video[]> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit);
    return this.http.get<Video[]>(this.apiUrl + '/videos', {params}).pipe(
      catchError(this.handleError<Video[]>('getVideos'))
    );
  }

  getVideosBySearch(page: number, limit: number, query: string): Observable<Video[]> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('query', query);
    return this.http.get<Video[]>(this.apiUrl + '/videos/search', {params}).pipe(
      catchError(this.handleError<Video[]>('getVideosBySearch'))
    );
  }

  getVideosByUser(): Observable<Video[]> {

    return this.http.post<Video[]>(this.apiUrl + '/videos/uploader', null, this.httpOptions).pipe(
      catchError(this.handleError<Video[]>('getVideosByUser'))
    );
  }



  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status == 500) {
        // set the error message
        this.formError = "An internal server error occurred.";
        return error;
      }
      if (error.status !== 200 && error.status !== 201) {
        // set the error message
        this.formError = error.error.error;
        return error;
      }

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
