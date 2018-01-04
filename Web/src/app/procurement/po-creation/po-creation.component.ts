import { Component, OnInit } from '@angular/core';
import { ProcurementService } from '../../services/procurement.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import * as ProcurementModels from '../../models/procurement';

@Component({
  selector: 'app-po-creation',
  templateUrl: './po-creation.component.html',
  styleUrls: ['./po-creation.component.css']
})
export class PoCreationComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  purchaseOrderList: Array<ProcurementModels.PurchaseOrder> = new Array<ProcurementModels.PurchaseOrder>();
  purchaseOrder: ProcurementModels.PurchaseOrder = new ProcurementModels.PurchaseOrder();
  constructor(private user: UserService,
    private procurementService: ProcurementService,
    private alertService: AlertService
  ) { 
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();
    this.fetchPOs();
  }

  ngOnInit() {
  }
  fetchPOs(){
    this.procurementService.getPoData()
    .then((results: any) => {
      this.purchaseOrderList = results;
      this.procurementService.getAllPurchaseOrders('approved')
      .then((results: any) => {
        if(results.purchaseOrders){
          results.purchaseOrders.forEach(element => {
            this.purchaseOrderList = this.purchaseOrderList.filter(function(o){return o.purchaseOrderNumber !== element.purchaseOrderNumber; });
          });  
        }
      });
    });
  }
  
  setPO() {
    if (this.purchaseOrder && this.purchaseOrder.purchaseOrderNumber) {
      this.purchaseOrderList.forEach(element => {
        if (element.purchaseOrderNumber === this.purchaseOrder.purchaseOrderNumber) {
          this.purchaseOrder = JSON.parse(JSON.stringify(element));
          this.purchaseOrder.orderedMaterial.forEach(element => {
            element.expectedDeliveryDate = new Date();
            element.expectedDeliveryDate.setDate((new Date().getDate()) + 10);
          });
          this.calculateOrderAmount();
        }
      });
    }
    else {
      this.purchaseOrder = new ProcurementModels.PurchaseOrder();
    }
  }

  calculateOrderAmount(){
    var total=0;
    this.purchaseOrder.orderedMaterial.forEach(element => {
        element.netAmount = Number(element.quantity) * Number(element.pricePerUnit);
        total += element.netAmount;
    });
    this.purchaseOrder.totalOrderAmount = total.toString();
  }

  changeSupplier(){
    console.log(this.commonData.supplierDetails);
    this.userData.users.vendors.forEach(element => {
      if(element.supplierName == this.purchaseOrder.supplierName){
        this.purchaseOrder.supplierUniqueNo = element.supplierUniqueNo;
        this.purchaseOrder.supplierContactPerson = element.supplierContactPerson;
        this.purchaseOrder.supplierContactPersonAddress = element.supplierContactPersonAddress;
        this.purchaseOrder.supplierContactPersonPhone = element.supplierContactPersonPhone;
        this.purchaseOrder.supplierContactPersonEmail = element.supplierContactPersonEmail;
      }
    });
  }

  updatePO(){
    this.purchaseOrder.status = "Approved";
    this.procurementService.savePurchaseOrder(this.purchaseOrder)
    .then((results: any) => {
      this.alertService.success("Purchase Order approved.");
      this.fetchPOs();
      this.purchaseOrder = new ProcurementModels.PurchaseOrder();
    });
  }
}
