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

  generateInvoice(){
    
  }
}
