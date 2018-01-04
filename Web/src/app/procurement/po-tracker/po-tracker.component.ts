import { Component, OnInit } from '@angular/core';
import { ProcurementService } from '../../services/procurement.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';


@Component({
  selector: 'app-po-tracker',
  templateUrl: './po-tracker.component.html',
  styleUrls: ['./po-tracker.component.css']
})
export class PoTrackerComponent implements OnInit {

  inputPurchaseOrderNumber: any;
  poTrackingDetails: any;
  constructor(private procurementService: ProcurementService,
    private alertService: AlertService) {
      this.poTrackingDetails = {};
      this.poTrackingDetails.PurchaseOrders = {};
      this.poTrackingDetails.VendorSalesOrder = {};
      this.poTrackingDetails.GoodsIssue = {};
      this.poTrackingDetails.LogisticTransaction = {};
      this.poTrackingDetails.VendorInvoices = {};
      this.poTrackingDetails.GoodsReceipts = {};
      this.poTrackingDetails.FinanceInvoices = {};
   }

  ngOnInit() {
  }

//this.inputPurchaseOrderNumber   "38700624687"
  getPurchaseOrderTrackingDetails(){
    if(this.inputPurchaseOrderNumber !== ''){
      this.procurementService.getPurchaseOrderTrackingDetails('po', this.inputPurchaseOrderNumber) 
      .then((results: any) => {
        if(results){
          this.poTrackingDetails = results;
        }
        else{
          this.poTrackingDetails = {};
        }
      });
    }
  }

}
