import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../services/vendor.service';
import { ProcurementService } from '../../services/procurement.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { LogisticService } from '../../services/logistic.service';
import { FinanceService } from '../../services/finance.service';
import * as VendorModels from '../../models/vendor';
import * as FinanceModels from '../../models/finance';
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
  financeInvoice: FinanceModels.FinanceInvoice = new FinanceModels.FinanceInvoice();
  goodsIssueList: Array<VendorModels.GoodsIssue> = new Array<VendorModels.GoodsIssue>();
  goodsReceipt: ProcurementModels.GoodsReceipt = new ProcurementModels.GoodsReceipt();
  logisticTransactionList: Array<LogisticModels.LogisticTransaction> = new Array<LogisticModels.LogisticTransaction>();
  constructor(private alertService: AlertService,
    private vendorService: VendorService,
    private procurementService: ProcurementService,
    private logisticService: LogisticService,
    private financeService: FinanceService,
    private user: UserService) { 
      this.currentUser = this.user.getUserLoggedIn();
      this.userData = this.user.getUserData();
      this.commonData = this.user.getCommonData();       
      this.goodsReceipt.goodsReceiptDate= new Date();
      this.getUniqueId();
  }

  ngOnInit() {
  }

  getGoodsReceipt(){
    this.procurementService.getAllGoodsReceiptDetails('po', this.goodsReceipt.purchaseOrderRefNumber)
    .then((results: any) => {
      if(results && results.goodsReceipts){
        this.goodsReceipt = results.goodsReceipts[0];
        this.vendorService.getAllGoodsIssue('po', this.goodsReceipt.purchaseOrderRefNumber)
        .then((results: any) => {
          if(results && results.goodsIssueList){
            this.goodsIssueList = results.goodsIssueList;
          }
        });
        this.logisticService.getAllLogisticTransactions('po', this.goodsReceipt.purchaseOrderRefNumber)
        .then((results: any) => {        
          if(results && results.logisticTransactions && results.logisticTransactions.length > 0){
            this.logisticTransactionList = results.logisticTransactions;            
          }  
        });

        this.goodsReceipt.materialList.forEach(element => {
          element.receivedQuantity = element.receivedQuantity ? element.receivedQuantity : null;
          element.fdfDisabled = element.fdf && element.fdf.toString() == "true" ? true : false;
          element.fdf = element.fdf && element.fdf.toString() == "true" ? true : false;
        });
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

  saveGoodsReceipt(myForm: NgForm) {
    this.procurementService.saveGoodsReceipt(this.goodsReceipt)
      .then((results: any) => {
        this.alertService.success("Goods Receipt Saved.");
        this.financeService.getAllFinanceInvoices("po", this.goodsReceipt.purchaseOrderRefNumber)
        .then((results: any) => {
          if(results && results.financeInvoices && results.financeInvoices.length > 0){
            this.financeInvoice = results.financeInvoices[0];
            this.financeInvoice.statusUpdates.push(      
              {
                status: "Posted",
                updatedBy: this.currentUser.id,
                updatedOn: new Date()
              }
            );
            this.financeService.updateFinanceInvoice(this.financeInvoice)
            .then((results: any) => {
              this.alertService.success("Finance Invoice Posted for this Purchase Order.");
            });
          }
        });
        this.getGoodsReceipt();
      });
  }

  clearForm(myForm: NgForm){
    myForm.resetForm();
    this.goodsReceipt = new ProcurementModels.GoodsReceipt();
    this.goodsReceipt.goodsReceiptDate= new Date();
    this.getUniqueId();
  }
}
