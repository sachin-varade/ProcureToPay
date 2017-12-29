import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';
import { LogisticService } from '../../services/logistic.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { VendorService } from '../../services/vendor.service';
import * as LogisticModels from '../../models/logistic';
import * as VendorModels from '../../models/vendor';

@Component({
  selector: 'app-create-consignment',
  templateUrl: './create-consignment.component.html',
  styleUrls: ['./create-consignment.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateConsignmentComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  logisticTransaction: LogisticModels.LogisticTransaction = new LogisticModels.LogisticTransaction();
  vendorSalesOrderList: Array<VendorModels.VendorSalesOrder> = new Array<VendorModels.VendorSalesOrder>();
  vendorSalesOrder: VendorModels.VendorSalesOrder = new VendorModels.VendorSalesOrder();
  pickedupDatetime: any = null;
  expectedDeliveryDatetime: any = null;
  actualDeliveryDatetime: any = null;
  constructor(private user: UserService,
    private logisticService: LogisticService,
    private alertService: AlertService,
    private vendorService: VendorService
  ) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();
    this.fetchAllVendorSOs();
    this.getUniqueId();
  }

  getUniqueId() {
    this.logisticService.getUniqueId('vendor-consignment')
      .then((results: any) => {
        this.logisticTransaction.consignmentNumber = results;
      });
  }

  ngOnInit() {
  }

  fetchAllVendorSOs() {
    this.vendorService.getAllVendorSalesOrders('details')
      .then((results: any) => {
        this.vendorSalesOrderList = results.vendorSalesOrders;
      });
  }

  changeSONumber() {
    this.vendorSalesOrderList.forEach(element => {
      if (element.salesOrderNumber == this.logisticTransaction.salesOrderRefNumber) {
        this.vendorSalesOrder = JSON.parse(JSON.stringify(element));
        this.logisticTransaction.purchaseOrderRefNumber = element.purchaseOrderRefNumber;
        this.logisticTransaction.supplierNumber = element.invoicePartyId;
        this.logisticTransaction.shipToParty = element.deliverToPersonName;
      }
    });
  }

  saveLogisticTransaction(myForm: NgForm) {
    this.logisticTransaction.pickedupDatetime.setHours(this.pickedupDatetime.hour);
    this.logisticTransaction.pickedupDatetime.setMinutes(this.pickedupDatetime.minute);
    this.logisticTransaction.expectedDeliveryDatetime.setHours(this.expectedDeliveryDatetime.hour);
    this.logisticTransaction.expectedDeliveryDatetime.setMinutes(this.expectedDeliveryDatetime.minute);
    this.logisticTransaction.actualDeliveryDatetime.setHours(this.actualDeliveryDatetime.hour);
    this.logisticTransaction.actualDeliveryDatetime.setMinutes(this.actualDeliveryDatetime.minute);
    this.logisticTransaction.status = "delivered";
    this.logisticService.saveLogisticTransaction(this.logisticTransaction)
      .then((results: any) => {
        this.alertService.success("Consignment " + this.logisticTransaction.consignmentNumber + " Saved.");
        this.clearForm(myForm);
        this.getUniqueId();
      });
  }

  clearForm(myForm: NgForm) {
    myForm.resetForm();
    this.logisticTransaction = new LogisticModels.LogisticTransaction();
  }
}