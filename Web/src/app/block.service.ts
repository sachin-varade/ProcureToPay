import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as Constants from './constants';
import { UserService } from './user.service';
import { AlertService } from './alert.service';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

@Injectable()
export class BlockService {
  private BASE_URL = Constants.API_URL;
  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  private url = '';
  constructor(private http: HttpClient,
    private userService: UserService,
  private alertService: AlertService) { }
  
    getRecentBlocks(blockNumber): Promise<any> {
    var role = this.userService.getUserLoggedIn().role;
    
    this.url = this.BASE_URL +"/getRecentBlocks" +"/"+ role;
    return this.http.get(this.url+"/"+ blockNumber).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

}

