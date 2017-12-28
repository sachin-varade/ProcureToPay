import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../services/vendor.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import * as VendorModels from '../../models/vendor';

@Component({
  selector: 'app-goods-issue',
  templateUrl: './goods-issue.component.html',
  styleUrls: ['./goods-issue.component.css']
})
export class GoodsIssueComponent implements OnInit {

  currentUser: any;
  commonData: any;
  userData: any;

  salesOrderList: Array<VendorModels.VendorSalesOrder> = new Array<VendorModels.VendorSalesOrder>();
  salesOrder: VendorModels.VendorSalesOrder = new VendorModels.VendorSalesOrder();

  constructor( 
    private alertService: AlertService,
    private vendorService: VendorService,
    private user: UserService) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData(); 
    this.fetchAllVendorSOs();
    this.getUniqueId();
  }

  ngOnInit() {
  }

  getUniqueId(){
    this.vendorService.getUniqueId('goods-issue')
    .then((results: any) => {
      this.salesOrder.goodsIssueNumber = results;
    });
  }

  fetchAllVendorSOs(){
    this.vendorService.getAllVendorSalesOrders('details')
    .then((results: any) => {
      this.salesOrderList = results.vendorSalesOrders;
      if(this.salesOrderList){
        this.salesOrder = JSON.parse(JSON.stringify(this.salesOrderList[0]));
      }
    });
  }

  setSO(){
    this.salesOrderList.forEach(element => {
      if(element.salesOrderNumber === this.salesOrder.salesOrderNumber){
        this.salesOrder = JSON.parse(JSON.stringify(element));
        this.getUniqueId();
      }
    });
  }


  createGoodsIssue(){
    this.vendorService.saveGoodsIssue(this.salesOrder)
    .then((results: any) => {
      this.alertService.success("Goods issued." + this.salesOrder.goodsIssueNumber);
      this.fetchAllVendorSOs();
      this.getUniqueId();
    });
    
  }


}
