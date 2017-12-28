import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../services/vendor.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import * as VendorModels from '../../models/vendor';

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
  }

  getAllGoodsIssue(){
    this.vendorService.getAllGoodsIssue('details')
    .then((results: any) => {
      this.goodsIssueList = results.goodsIssueList;
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

  setGIN(){
    this.goodsIssueList.forEach(element => {
      if(element.goodsIssueNumber === this.vendorInvoice.goodsIssueNumber){
        this.vendorService.getAllVendorSalesOrders('id', element.salesOrderNumber)
        .then((results: any) => {          
          
          this.vendorInvoice.invoiceDate= new Date();
          this.vendorInvoice.goodsIssueNumber= element.goodsIssueNumber;
          this.vendorInvoice.goodsIssueDate= new Date();

          this.vendorInvoice.salesOrderNumber= element.salesOrderNumber;
          
          this.vendorInvoice.purchaseOrderRefNumber = results.vendorSalesOrders[0].purchaseOrderRefNumber;
          this.vendorInvoice.purchaseOrderRefDate = results.vendorSalesOrders[0].purchaseOrderRefDate;
          this.vendorInvoice.supplierCode = results.vendorSalesOrders[0].
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
          this.vendorInvoice.grossAmount = results.vendorSalesOrders[0].
          this.vendorInvoice.vatNumber = results.vendorSalesOrders[0].vatNo;
          this.vendorInvoice.materialList = results.vendorSalesOrders[0].materialList;
        });
      }
    });
  }
  generateInvoice(){
    
  }
}
