import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as ProcurementModels from '../models/procurement';
import * as FinanceModels from '../models/finance';
import * as Constants from '../constants';
import { AlertService } from './alert.service';
import { Observable } from "rxjs/Observable";
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

@Injectable()
export class FinanceService {
  private BASE_URL = Constants.API_URL;
  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  private url = '';

  constructor(private http: HttpClient,
    private alertService: AlertService) { 
  }

  saveFinanceInvoice(salesOrder: FinanceModels.FinanceInvoice): Promise<any> {
    this.url = `${this.BASE_URL}/saveFinanceInvoice`;
    return this.http.post(this.url, salesOrder).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error(err);
    });
  }

  getAllFinanceInvoices(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getAllFinanceInvoices`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }
}
