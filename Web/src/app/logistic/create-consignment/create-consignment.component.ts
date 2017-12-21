import { Component, OnInit } from '@angular/core';
import { LogisticService } from '../../services/logistic.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import * as LogisticModels from '../../models/logistic';

@Component({
  selector: 'app-create-consignment',
  templateUrl: './create-consignment.component.html',
  styleUrls: ['./create-consignment.component.css']
})
export class CreateConsignmentComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;  
  logisticTransaction: LogisticModels.LogisticTransaction = new LogisticModels.LogisticTransaction();
  constructor(private user: UserService,
    private logisticService: LogisticService,
    private alertService: AlertService
  ) { 
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();

    this.logisticService.getUniqueId('logistic')
    .then((results: any) => {
      this.logisticTransaction.consignmentNumber = results;
    });
  }

  ngOnInit() {
  }

  saveLogisticTransaction(){    
    this.logisticService.saveLogisticTransaction(this.logisticTransaction)
    .then((results: any) => {
      this.alertService.success("Consignment Saved.");
    });
  }
}