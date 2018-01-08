import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../services/vendor.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-so-tracker',
  templateUrl: './so-tracker.component.html',
  styleUrls: ['./so-tracker.component.css']
})
export class SoTrackerComponent implements OnInit {

  inputSalesOrderNumber: any;
  poTrackingDetails: any;
  constructor(private vendorService: VendorService,
    private alertService: AlertService) {
    this.poTrackingDetails = {};
    this.poTrackingDetails.VendorSalesOrder = {};
    this.poTrackingDetails.GoodsIssue = {};
    this.poTrackingDetails.LogisticTransaction = {};
    this.poTrackingDetails.VendorInvoices = {};
    this.poTrackingDetails.GoodsReceipts = {};
    this.poTrackingDetails.FinanceInvoices = {};
  }

  ngOnInit() {
  }

  getSalesOrderTrackingDetails() {
    if (this.inputSalesOrderNumber !== '') {
      this.vendorService.getSalesOrderTrackingDetails('id', this.inputSalesOrderNumber)
        .then((results: any) => {
          if (results) {
            //alert(JSON.stringify(results));
            this.poTrackingDetails = results;
          }
          else {
            this.poTrackingDetails = {};
          }
        });
    }
  }

}
