import { Component, OnInit } from '@angular/core';
import { ProcurementService } from '../../services/procurement.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import * as ProcurementModels from '../../models/procurement';

@Component({
  selector: 'app-po-dashboard',
  templateUrl: './po-dashboard.component.html',
  styleUrls: ['./po-dashboard.component.css']
})
export class PoDashboardComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  dashboardData: any;
  selectedTab: string = "100-y"
  constructor(private user: UserService,
    private procurementService: ProcurementService,
    private alertService: AlertService
  ) { 
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();
    this.getAllDashboardData();
  }

  changeTab(option){
    this.selectedTab = option;
    this.getAllDashboardData();
  }

  getAllDashboardData(){
    this.procurementService.getAllDashboardData('pos', this.selectedTab)
    .then((results: any) => {        
      if(results){
        this.dashboardData = results;
        if(this.dashboardData.purchaseOrders){
          this.dashboardData.purchaseOrdersCount = this.dashboardData.purchaseOrders.length;
          this.dashboardData.purchaseOrdersPaid =  this.dashboardData.purchaseOrders.filter(function(o){return o.statusUpdates.filter(function(j){return j.status === "Paid"}) && o.statusUpdates.filter(function(j){return j.status.toLowerCase() === "paid"}).length > 0 });
          this.dashboardData.purchaseOrdersPaidCount = this.dashboardData.purchaseOrdersPaid.length;
        }
        if(this.dashboardData.vendorSalesOrders){
          this.dashboardData.vendorSalesOrdersCount = this.dashboardData.vendorSalesOrders.length;
        }
        if(this.dashboardData.goodsIssueList){
          this.dashboardData.goodsIssueListCount = this.dashboardData.goodsIssueList.length;
        }
        if(this.dashboardData.logisticTransactions){
          this.dashboardData.logisticTransactionsCount = this.dashboardData.logisticTransactions.length;
        }
        if(this.dashboardData.vendorInvoices){
          this.dashboardData.vendorInvoicesCount = this.dashboardData.vendorInvoices.length;
        }
        if(this.dashboardData.goodsReceipts){
          this.dashboardData.goodsReceiptsCount = this.dashboardData.goodsReceipts.length;
        }
        if(this.dashboardData.financeInvoices){
          this.dashboardData.financeInvoicesCount = this.dashboardData.financeInvoices.length;
        }
        if(this.dashboardData.paymentProposals){
          this.dashboardData.paymentProposalsCount = this.dashboardData.paymentProposals.length;
        }
      }  
    });
  }

  ngOnInit() {
  }

}
