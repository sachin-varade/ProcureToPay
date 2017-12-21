import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as LogisticModels from '../models/logistic';
import * as Constants from '../constants';
import { AlertService } from './alert.service';
import { Observable } from "rxjs/Observable";
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

@Injectable()
export class LogisticService {
  private BASE_URL = Constants.API_URL;
  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  private url = '';
  constructor(private http: HttpClient,
  private alertService: AlertService) { }

  saveLogisticTransaction(logisticTransaction: LogisticModels.LogisticTransaction): Promise<any> {
    this.url = `${this.BASE_URL}/saveLogisticTransaction`;
    return this.http.post(this.url, logisticTransaction).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error(err);
    });
  }

  getAllLogisticTransactions(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getAllLogisticTransactions`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  getUniqueId(option: string, value: string = ""): Promise<any> {
    this.url = this.BASE_URL +"/procurement/getUniqueId";
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return results.uniqueId;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

}