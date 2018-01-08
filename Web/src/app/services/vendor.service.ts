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
export class VendorService {
  private BASE_URL = Constants.API_URL;
  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  private url = '';

  constructor(private http: HttpClient,
    private alertService: AlertService) { 

  }

  createVendorSalesOrder(salesOrder: VendorModels.VendorSalesOrder): Promise<any> {
    this.url = `${this.BASE_URL}/createVendorSalesOrder`;
    return this.http.post(this.url, salesOrder).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error(err);
    });
  }

  getUniqueId(option: string, value: string = ""): Promise<any> {
    this.url = this.BASE_URL +"/vendor/getUniqueId";
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return results.uniqueId;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  getAllVendorSalesOrders(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getAllVendorSalesOrders`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  getAllGoodsIssue(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getAllGoodsIssue`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  saveGoodsIssue(salesOrder: VendorModels.VendorSalesOrder): Promise<any> {
    this.url = `${this.BASE_URL}/saveGoodsIssue`;
    return this.http.post(this.url, salesOrder).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error(err);
    });
  }

  saveVendorInvoice(salesOrder: VendorModels.VendorInvoice): Promise<any> {
    this.url = `${this.BASE_URL}/saveVendorInvoice`;
    return this.http.post(this.url, salesOrder).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error(err);
    });
  }

  getAllVendorInvoices(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getAllVendorInvoices`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  getSalesOrderTrackingDetails(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getSalesOrderTrackingDetails`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

}
