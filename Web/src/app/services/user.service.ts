import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as Constants from '../constants';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

@Injectable()
export class UserService {

  private BASE_URL = Constants.API_URL;
  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  private loggedInUser: any = null;

  constructor(private http: HttpClient) {
    if (sessionStorage.getItem('loggedInUser')) {
      this.loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    }
  }

  login(user): Promise<any> {
    const url = `${this.BASE_URL}/login`;
    return this.http.post(url, user).toPromise()
    .then((results: any) => {
      if(!results || !results.name){
        return results;
      }
      this.loggedInUser = results;
      sessionStorage.setItem('loggedInUser', JSON.stringify(results));
      return results;
    }).catch((err) => {
        throw err;
    });
  }

  logout() {
    sessionStorage.setItem('isUserLoggedIn', null);
    sessionStorage.setItem('loggedInUser', null);
    sessionStorage.setItem('userData', null);
    sessionStorage.setItem('commonData', null);
  }

  getUserData(): Promise<any> {
    if (sessionStorage.getItem('userData') !== null && sessionStorage.getItem('userData') !== 'null') {
      return JSON.parse(sessionStorage.getItem('userData'));
    } else {
      const url = `${this.BASE_URL}/getUserData`;
      return this.http.get(url).toPromise()
      .then((results: any) => {
        sessionStorage.setItem('userData', JSON.stringify(results));
        return results;
      }).catch((err) => {
          throw err;
      });
    }
  }

  getCommonData(): Promise<any> {
    if (sessionStorage.getItem('commonData') !== null && sessionStorage.getItem('commonData') !== 'null') {
      return JSON.parse(sessionStorage.getItem('commonData'));
    } else {
      const url = `${this.BASE_URL}/getCommonData`;
      return this.http.get(url).toPromise()
      .then((results: any) => {
        sessionStorage.setItem('commonData', JSON.stringify(results));
        return results;
      }).catch((err) => {
          throw err;
      });
    }
  }

  setUserLoggedIn() {
    sessionStorage.setItem('isUserLoggedIn', 'true');
  }

  isUserLoggedIn() {
    return sessionStorage.getItem('isUserLoggedIn');
  }

  getUserLoggedIn() {
    if(sessionStorage.getItem('loggedInUser') !== ''){
      return JSON.parse(sessionStorage.getItem('loggedInUser'));
    }
  }
}
