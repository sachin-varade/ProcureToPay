import { Component, OnInit } from '@angular/core';
import { ProcurementService } from '../../services/procurement.service';
import * as ProcurementModels from '../../models/procurement';

@Component({
  selector: 'app-po-fulfilment',
  templateUrl: './po-fulfilment.component.html',
  styleUrls: ['./po-fulfilment.component.css']
})
export class PoFulfilmentComponent implements OnInit {

  purchaseOrderList: Array<ProcurementModels.PurchaseOrder> = new Array<ProcurementModels.PurchaseOrder>();
  purchaseOrder: ProcurementModels.PurchaseOrder = new ProcurementModels.PurchaseOrder();
  
  constructor(private procurementService: ProcurementService) { 
    this.fetchApprovedPOs();
  }

  ngOnInit() {
  }

  fetchApprovedPOs(){
    this.procurementService.getAllPurchaseOrders('approved')
    .then((results: any) => {
      this.purchaseOrderList = results.purchaseOrders;
      if(this.purchaseOrderList){
        this.purchaseOrder = JSON.parse(JSON.stringify(this.purchaseOrderList[0]));
        //this.purchaseOrder.deliverToPersonName
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

}