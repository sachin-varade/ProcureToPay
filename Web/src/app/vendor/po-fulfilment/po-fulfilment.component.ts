import { Component, OnInit } from '@angular/core';
import { ProcurementService } from '../../services/procurement.service';
import { VendorService } from '../../services/vendor.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import * as ProcurementModels from '../../models/procurement';
import * as VendorModels from '../../models/vendor';


@Component({
  selector: 'app-po-fulfilment',
  templateUrl: './po-fulfilment.component.html',
  styleUrls: ['./po-fulfilment.component.css']
})
export class PoFulfilmentComponent implements OnInit {

  currentUser: any;
  commonData: any;
  userData: any;

  purchaseOrderList: Array<ProcurementModels.PurchaseOrder> = new Array<ProcurementModels.PurchaseOrder>();
  purchaseOrder: ProcurementModels.PurchaseOrder = new ProcurementModels.PurchaseOrder();
  salesOrder: VendorModels.VendorSalesOrder = new VendorModels.VendorSalesOrder();
  
  constructor(private procurementService: ProcurementService, 
    private alertService: AlertService,
    private vendorService: VendorService,
    private user: UserService) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData(); 
    this.fetchApprovedPOs();
    this.getUniqueId(); 
  }

  ngOnInit() {
  }

  getUniqueId(){
    this.vendorService.getUniqueId('vendor')
    .then((results: any) => {
      this.salesOrder.salesOrderNumber = results;
    });
  }

  fetchApprovedPOs(){
    this.procurementService.getAllPurchaseOrders('approved')
    .then((results: any) => {
      this.purchaseOrderList = results.purchaseOrders;
      if(this.purchaseOrderList){
        this.purchaseOrder = JSON.parse(JSON.stringify(this.purchaseOrderList[0]));
      }
    });
  }

  setPO(){
    this.purchaseOrderList.forEach(element => {
      if(element.purchaseOrderNumber === this.purchaseOrder.purchaseOrderNumber){
        this.purchaseOrder = JSON.parse(JSON.stringify(element));
      }
    });
  }

  createSO(){
    this.salesOrder.purchaseOrderRefNumber = this.purchaseOrder.purchaseOrderNumber;
    this.salesOrder.purchaseOrderRefDate = this.purchaseOrder.purchaseOrderDate;
    this.salesOrder.purchaserCompany = this.purchaseOrder.buyerCompany;
    this.salesOrder.purchaserCompanyDept = this.purchaseOrder.buyerDepartment;
    this.salesOrder.purchaserContactPersonName = this.purchaseOrder.buyerContactPerson;
    this.salesOrder.purchaserContactPersonAddress = this.purchaseOrder.buyerContactPersonAddress;
    this.salesOrder.purchaserContactPersonPhone = this.purchaseOrder.buyerContactPersonPhone
    this.salesOrder.purchaserContactPersonEmail = this.purchaseOrder.buyerContactPersonEmail;
    this.salesOrder.deliverToPersonName = this.purchaseOrder.deliverToPersonName;
    this.salesOrder.deliveryAddress = this.purchaseOrder.deliverToPersonAddress;
    this.salesOrder.invoicePartyId = "101";
    this.salesOrder.invoicePartyAddress = this.purchaseOrder.invoiceAddress
    //this.salesOrder.materialList //TODO : MDM
    this.salesOrder.status = "Created";
    this.salesOrder.statusUpdatedOn = new Date();
    this.salesOrder.statusUpdatedBy = this.currentUser.name;

    this.vendorService.createVendorSalesOrder(this.salesOrder)
    .then((results: any) => {
      this.alertService.success("Sales Order created." + this.salesOrder.salesOrderNumber);
      this.fetchApprovedPOs();
    });
  }

}