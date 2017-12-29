import { Component, OnInit } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';
import { VendorService } from '../../services/vendor.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import * as VendorModels from '../../models/vendor';
import { StatusUpdates } from '../../models/vendor';

@Component({
  selector: 'app-generate-invoice',
  templateUrl: './generate-invoice.component.html',
  styleUrls: ['./generate-invoice.component.css']
})
export class GenerateInvoiceComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  vendorInvoice: VendorModels.VendorInvoice = new VendorModels.VendorInvoice();
  goodsIssueList: Array<VendorModels.GoodsIssue> = new Array<VendorModels.GoodsIssue>();
  constructor(private alertService: AlertService,
    private vendorService: VendorService,
    private user: UserService) {
      this.currentUser = this.user.getUserLoggedIn();
      this.userData = this.user.getUserData();
      this.commonData = this.user.getCommonData(); 
      this.getAllGoodsIssue();
      this.getUniqueId();
      this.vendorInvoice.invoiceDate= new Date();
  }

  getAllGoodsIssue(){
    this.vendorService.getAllGoodsIssue('details')
    .then((results: any) => {
      this.goodsIssueList = results.goodsIssueList;
      this.vendorService.getAllVendorInvoices('details')
      .then((results: any) => {
        if(results.vendorInvoices){
          results.vendorInvoices.forEach(element => {
            this.goodsIssueList = this.goodsIssueList.filter(function(o){return o.goodsIssueNumber !== element.goodsIssueNumber; });
          });
        }
      });
    });
  }

  getUniqueId(){
    this.vendorService.getUniqueId('invoice')
    .then((results: any) => {
      this.vendorInvoice.invoiceNumber = results;
    });
  }

  ngOnInit() {
  }

  setGIN(myForm: NgForm){
    if(this.vendorInvoice && this.vendorInvoice.goodsIssueNumber){
      this.goodsIssueList.forEach(element => {
        if(element.goodsIssueNumber === this.vendorInvoice.goodsIssueNumber){
          this.vendorService.getAllVendorSalesOrders('id', element.salesOrderNumber)
          .then((results: any) => {          
            
            this.vendorInvoice.goodsIssueNumber= element.goodsIssueNumber;
            this.vendorInvoice.goodsIssueDate= element.goodsIssueDate;

            this.vendorInvoice.salesOrderNumber= element.salesOrderNumber;
            
            this.vendorInvoice.purchaseOrderRefNumber = results.vendorSalesOrders[0].purchaseOrderRefNumber;
            this.vendorInvoice.purchaseOrderRefDate = results.vendorSalesOrders[0].purchaseOrderRefDate;
            this.vendorInvoice.supplierCode = results.vendorSalesOrders[0].supplierCode;
            this.vendorInvoice.purchaserCompany = results.vendorSalesOrders[0].purchaserCompany;
            this.vendorInvoice.purchaserCompanyDept = results.vendorSalesOrders[0].purchaserCompanyDept;
            this.vendorInvoice.purchaserContactPersonName = results.vendorSalesOrders[0].purchaserContactPersonName;
            this.vendorInvoice.purchaserContactPersonAddress = results.vendorSalesOrders[0].purchaserContactPersonAddress;
            this.vendorInvoice.purchaserContactPersonPhone = results.vendorSalesOrders[0].purchaserContactPersonPhone;
            this.vendorInvoice.purchaserContactPersonEmail = results.vendorSalesOrders[0].purchaserContactPersonEmail;
            this.vendorInvoice.deliverToPersonName = results.vendorSalesOrders[0].deliverToPersonName;
            this.vendorInvoice.deliveryAddress = results.vendorSalesOrders[0].deliveryAddress;
            this.vendorInvoice.invoicePartyId = results.vendorSalesOrders[0].invoicePartyId;
            this.vendorInvoice.invoiceAddress = results.vendorSalesOrders[0].invoicePartyAddress;
                    
            this.vendorInvoice.vatNumber = results.vendorSalesOrders[0].vatNo;
            this.vendorInvoice.materialList = element.materialList;

            this.vendorInvoice.grossAmount = 0;
            this.vendorInvoice.materialList.forEach(element => {
              this.vendorInvoice.grossAmount += Number(element.netAmount);
            });            
          });
        }
      });
    }
    else{
      this.clearForm(myForm);
    }
    this.getUniqueId();
  }
  generateInvoice(myForm: NgForm){
    this.vendorInvoice.statusUpdates.push(      
      {
        status: "created",
        updatedBy: this.currentUser.id,
        updatedOn: new Date()
      }
    );
    this.vendorService.saveVendorInvoice(this.vendorInvoice)
    .then((results: any) => { 
      if(results && results.type && results.type === "ERROR"){
        if(results.message.indexOf('message:') > -1){
          this.alertService.error(results.message.replace("(","").replace(")","").split('message:')[1]);
        }
        else{
        this.alertService.error(results.message);
        }
      }      
      else{
        this.getAllGoodsIssue();        
        this.alertService.success("Invoice Saved.");
        this.clearForm(myForm);
      }
    });
  }

  clearForm(myForm: NgForm){
    myForm.resetForm();
    this.getUniqueId();
    this.vendorInvoice = new VendorModels.VendorInvoice();
    this.vendorInvoice.invoiceDate= new Date();
  }
}
