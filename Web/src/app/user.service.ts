import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as Constants from './constants';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

@Injectable()
export class UserService {

  private BASE_URL = Constants.API_URL;
  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  private loggedInUser: any = null;

  constructor(private http: HttpClient) {
    if (localStorage.getItem('loggedInUser')) {
      this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
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
      localStorage.setItem('loggedInUser', JSON.stringify(results));
      return results;
    }).catch((err) => {
        throw err;
    });
  }

  logout() {
    localStorage.setItem('isUserLoggedIn', null);
    localStorage.setItem('loggedInUser', null);
    localStorage.setItem('userData', null);
    localStorage.setItem('commonData', null);
  }

  getUserData(): Promise<any> {
    if (localStorage.getItem('userData') !== null && localStorage.getItem('userData') !== 'null') {
      return JSON.parse(localStorage.getItem('userData'));
    } else {
      const url = `${this.BASE_URL}/getUserData`;
      return this.http.get(url).toPromise()
      .then((results: any) => {
        localStorage.setItem('userData', JSON.stringify(results));
        return results;
      }).catch((err) => {
          throw err;
      });
    }
  }

  getCommonData(): Promise<any> {
    if (localStorage.getItem('commonData') !== null && localStorage.getItem('commonData') !== 'null') {
      return JSON.parse(localStorage.getItem('commonData'));
    } else {
      const url = `${this.BASE_URL}/getCommonData`;
      return this.http.get(url).toPromise()
      .then((results: any) => {
        localStorage.setItem('commonData', JSON.stringify(results));
        return results;
      }).catch((err) => {
          throw err;
      });
    }
  }

  setUserLoggedIn() {
    localStorage.setItem('isUserLoggedIn', 'true');
  }

  isUserLoggedIn() {
    return localStorage.getItem('isUserLoggedIn');
  }

  getUserLoggedIn() {
    if(localStorage.getItem('loggedInUser') !== ''){
      return JSON.parse(localStorage.getItem('loggedInUser'));
    }
  }
}
