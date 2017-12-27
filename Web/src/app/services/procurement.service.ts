import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as ProcurementModels from '../models/procurement';
import * as VendorModels from '../models/vendor';
import * as Constants from '../constants';
import { AlertService } from './alert.service';
import { Observable } from "rxjs/Observable";
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';


@Injectable()
export class ProcurementService {
  private BASE_URL = Constants.API_URL;
  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  private url = '';
  constructor(private http: HttpClient,
  private alertService: AlertService) { }

  savePurchaseOrder(purchaseOrder: ProcurementModels.PurchaseOrder): Promise<any> {
    this.url = `${this.BASE_URL}/savePurchaseOrder`;
    return this.http.post(this.url, purchaseOrder).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error(err);
    });
  }

  updatePurchaseOrder(purchaseOrder: ProcurementModels.PurchaseOrder): Promise<any> {
    this.url = `${this.BASE_URL}/updatePurchaseOrder`;
    return this.http.post(this.url, purchaseOrder).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error(err);
    });
  }

  getAllPurchaseOrders(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getAllPurchaseOrders`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  getPoData(): Promise<any> {
    const url = `${this.BASE_URL}/getPoData`;
    return this.http.get(url).toPromise()
    .then((results: any) => {      
      return results;
    }).catch((err) => {
        throw err;
    });
  }
  
}
