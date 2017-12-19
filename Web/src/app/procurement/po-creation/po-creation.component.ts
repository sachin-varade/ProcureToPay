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
    this.procurementService.getAllPurchaseOrders('created')
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

  updatePO(){
    this.procurementService.updatePurchaseOrder(this.purchaseOrder)
    .then((results: any) => {
      this.alertService.success("Purchase Order approved.");
      this.fetchPOs();
    });
  }
}
