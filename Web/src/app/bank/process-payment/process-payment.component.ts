import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { FinanceService } from '../../services/finance.service';
import { ProcurementService } from '../../services/procurement.service';
import * as VendorModels from '../../models/vendor';
import * as FinanceModels from '../../models/finance';
import * as ProcurementModels from '../../models/procurement';
import { NgModel, NgForm } from '@angular/forms';

@Component({
  selector: 'app-process-payment',
  templateUrl: './process-payment.component.html',
  styleUrls: ['./process-payment.component.css']
})
export class ProcessPaymentComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  purchaseOrder: ProcurementModels.PurchaseOrder = new ProcurementModels.PurchaseOrder();
  financeInvoice: FinanceModels.FinanceInvoice = new FinanceModels.FinanceInvoice();
  paymentProposalList: Array<FinanceModels.PaymentProposal> = new Array<FinanceModels.PaymentProposal>();
  paymentProposal: FinanceModels.PaymentProposal = new FinanceModels.PaymentProposal();
  totalAmount : number = 0;

  constructor(
    private alertService: AlertService,
    private user: UserService,
    private financeService: FinanceService,
    private procurementService: ProcurementService
  ) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();
    this.getAllPaymentProposals();
   }

  ngOnInit() {
  }

  changeProposal(){
    this.paymentProposalList.forEach(element => {
      if(this.paymentProposal.paymentProposalNumber === element.paymentProposalNumber){
        this.paymentProposal = JSON.parse(JSON.stringify(element));
        this.paymentProposal.paymentProposalDetails = JSON.parse(JSON.stringify((<any>element).proposalDetails));
        this.paymentProposal.paymentProposalDetails.forEach(element => {
          if(element.status.toLocaleLowerCase() == "paid"){
            element.selectedInUI = true;
          }
          else{
            element.selectedInUI = false;
          }
        });
      }
    });
    this.calculateTotalAmount();
  }

  calculateTotalAmount() {
    this.totalAmount = 0;
    for (let entry of this.paymentProposal.paymentProposalDetails) {
      if (entry.selectedInUI && entry.status != "Paid") {
        this.totalAmount = this.totalAmount + +entry.amount;
      }
    }
  }

  getAllPaymentProposals(){
    this.financeService.getAllPaymentProposals("details")
    .then((results: any) => {
      if(results && results.paymentProposals && results.paymentProposals.length > 0){
        this.paymentProposalList= results.paymentProposals;
      }
    });
  }

  processPayment(myForm: NgForm){
    let proposals: Array<any> = new Array<any>();
    this.paymentProposal.paymentProposalDetails.forEach(element => {
      element.oldStatus = element.status == "Posted" ? "Posted" : "Paid";
      if(element.selectedInUI && element.status.toLocaleLowerCase() != "paid"){
        element.status = "Paid";
        element.bankProcessingDate = new Date();
        proposals.push(element);
      } 
    });

    if(proposals.length > 0){          
      this.financeService.processPayment(this.paymentProposal)
      .then((results: any) => {
        this.alertService.success("Payment processed for " + this.paymentProposal.paymentProposalNumber);
        this.getAllPaymentProposals();
        this.financeService.getAllFinanceInvoices("po-posted", this.paymentProposal.paymentProposalDetails[0].poReferenceNumber)
        .then((results: any) => {
          if(results && results.financeInvoices && results.financeInvoices.length > 0){
            let invoicesToBePaid: Array<any> = new Array<any>();
            results.financeInvoices.forEach(invElement => {
              var invSelected = "0"
              this.paymentProposal.paymentProposalDetails.forEach(element => {
                if(element.InvoiceReferenceNumber == invElement.invoiceNumber && element.selectedInUI && element.oldStatus.toLocaleLowerCase() != "paid"){
                  invSelected = "1";
                }
              });
              if(invSelected == "1"){
                invElement.statusUpdates.push(      
                  {
                    status: "Paid",
                    updatedBy: this.currentUser.id,
                    updatedOn: new Date()
                  }
                );
                invoicesToBePaid.push(invElement);
              }
            });

            //this.financeInvoice = results.financeInvoices[0];
            this.financeService.updateFinanceInvoiceList(invoicesToBePaid)
            .then((results: any) => {
              this.alertService.success("Finance Invoice Updated to Paid.");

              // update PO status
              this.procurementService.getAllPurchaseOrders('id', this.paymentProposal.paymentProposalDetails[0].poReferenceNumber)
              .then((results: any) => {
                if(results && results.purchaseOrders && results.purchaseOrders.length > 0){
                  this.purchaseOrder = results.purchaseOrders[0];
                  this.purchaseOrder.statusUpdates.push(      
                    {
                      status: "Paid",
                      updatedBy: this.currentUser.id,
                      updatedOn: new Date()
                    }
                  );
                  this.procurementService.updatePurchaseOrderStatus(this.purchaseOrder)
                  .then((results: any) => {
                    this.alertService.success("Purchase Order updated to Paid.");            
                    this.purchaseOrder = new ProcurementModels.PurchaseOrder();
                    this.paymentProposal = new FinanceModels.PaymentProposal();
                  });
                }
              });
            });
          }
        });
      });
    }
    else{
      this.alertService.error("Please select atleast one payment proposal number.");            
      return false;
    }
  }
}
