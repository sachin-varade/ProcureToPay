import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../services/vendor.service';
import { ProcurementService } from '../../services/procurement.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { LogisticService } from '../../services/logistic.service';
import * as VendorModels from '../../models/vendor';
import * as ProcurementModels from '../../models/procurement';
import * as LogisticModels from '../../models/logistic';
import { NgModel, NgForm } from '@angular/forms';

@Component({
  selector: 'app-goods-receipt',
  templateUrl: './goods-receipt.component.html',
  styleUrls: ['./goods-receipt.component.css']
})
export class GoodsReceiptComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  goodsIssueList: Array<VendorModels.GoodsIssue> = new Array<VendorModels.GoodsIssue>();
  goodsReceipt: ProcurementModels.GoodsReceipt = new ProcurementModels.GoodsReceipt();
  logisticTransactionList: Array<LogisticModels.LogisticTransaction> = new Array<LogisticModels.LogisticTransaction>();
  constructor(private alertService: AlertService,
    private vendorService: VendorService,
    private procurementService: ProcurementService,
    private logisticService: LogisticService,
    private user: UserService) { 
      this.currentUser = this.user.getUserLoggedIn();
      this.userData = this.user.getUserData();
      this.commonData = this.user.getCommonData();       
  }

  ngOnInit() {
  }

  getGoodsReceipt(){
    this.procurementService.getAllGoodsReceiptDetails('po', this.goodsReceipt.purchaseOrderRefNumber)
    .then((results: any) => {
      if(results && results.GoodsReceiptNumbers){
        this.goodsReceipt = results.GoodsReceiptNumbers[0];
      }
      else{
        this.getAllGoodsIssue();
      }      
    });
  }

  getAllGoodsIssue(){
    this.vendorService.getAllGoodsIssue('po', this.goodsReceipt.purchaseOrderRefNumber)
    .then((results: any) => {
      if(results && results.goodsIssueList){
        this.goodsIssueList = results.goodsIssueList;
        this.goodsReceipt.goodsReceiptDate = new Date();
        this.goodsReceipt.goodIssueNumber = results.goodsIssueList[0].goodsIssueNumber;
        this.goodsReceipt.deliverToPersonName = results.goodsIssueList[0].deliverToPersonName;
        this.goodsReceipt.deliveryAddress = results.goodsIssueList[0].deliveryAddress;
        results.goodsIssueList[0].materialList.forEach(element => {
          element.pos = element.materialId;
        });
        this.goodsReceipt.materialList = results.goodsIssueList[0].materialList;       

        this.vendorService.getAllVendorSalesOrders('id', results.goodsIssueList[0].salesOrderNumber)
        .then((results: any) => {          
          this.goodsReceipt.purchaseOrderRefNumber = results.vendorSalesOrders[0].purchaseOrderRefNumber;
          this.goodsReceipt.purchaserCompany = results.vendorSalesOrders[0].purchaserCompany;
          this.goodsReceipt.purchaserCompanyDept = results.vendorSalesOrders[0].purchaserCompanyDept;
          this.goodsReceipt.purchaserContactPersonName = results.vendorSalesOrders[0].purchaserContactPersonName;
          this.goodsReceipt.purchaserContactPersonAddress = results.vendorSalesOrders[0].purchaserContactPersonAddress;
          this.goodsReceipt.purchaserContactPersonPhone = results.vendorSalesOrders[0].purchaserContactPersonPhone;
          this.goodsReceipt.purchaserContactPersonEmail = results.vendorSalesOrders[0].purchaserContactPersonEmail;
          this.goodsReceipt.deliverToPersonName = results.vendorSalesOrders[0].deliverToPersonName;
          this.goodsReceipt.deliveryAddress = results.vendorSalesOrders[0].deliveryAddress;
          this.logisticService.getAllLogisticTransactions('po', this.goodsReceipt.purchaseOrderRefNumber)
          .then((results: any) => {        
            if(results && results.logisticTransactions && results.logisticTransactions.length > 0){
              this.logisticTransactionList = results.logisticTransactions;
              this.goodsReceipt.consignmentNumber = this.logisticTransactionList[0].consignmentNumber;
            }  
          });
        });
        this.getUniqueId();
      }
      else{
        this.alertService.error("Purchase order not found.");
      }
    });
  }

  getUniqueId(){
    this.vendorService.getUniqueId('goods-receipt')
    .then((results: any) => {
      this.goodsReceipt.goodsReceiptNumber = results;
    });
  }

  clearForm(myForm: NgForm){
    myForm.resetForm();
    this.goodsReceipt = new ProcurementModels.GoodsReceipt();
    this.goodsReceipt.goodsReceiptDate= new Date();
    this.getUniqueId();
  }
}
