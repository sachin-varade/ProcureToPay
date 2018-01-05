import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../services/vendor.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { FinanceService } from '../../services/finance.service';
import * as VendorModels from '../../models/vendor';
import * as FinanceModels from '../../models/finance';
import { NgModel, NgForm } from '@angular/forms';


@Component({
  selector: 'app-payment-proposal',
  templateUrl: './payment-proposal.component.html',
  styleUrls: ['./payment-proposal.component.css']
})
export class PaymentProposalComponent implements OnInit {

  currentUser: any;
  commonData: any;
  userData: any;
  paymentProposal: FinanceModels.PaymentProposal = new FinanceModels.PaymentProposal();
  financeInvoiceList: Array<FinanceModels.FinanceInvoice> = new Array<FinanceModels.FinanceInvoice>();
  selectedVendor: VendorModels.Vendor = new VendorModels.Vendor();
  totalAmount : number = 0;

  constructor(
    private alertService: AlertService,
    private vendorService: VendorService,
    private user: UserService,
    private financeService: FinanceService) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();
    this.getUniqueId();
    this.paymentProposal.proposalDate = new Date();
  }

  ngOnInit() {
  }

  getUniqueId() {
    this.financeService.getUniqueId('payment-proposal')
      .then((results: any) => {
        this.paymentProposal.paymentProposalNumber = results;
      });
  }

  changeVendor() {
    this.userData.users.vendors.forEach(element => {
      if (element.name === this.selectedVendor.name) {
        this.selectedVendor = JSON.parse(JSON.stringify(element));
        this.paymentProposal.vendorUniqueId = this.selectedVendor.supplierUniqueNo;
        this.paymentProposal.vendorBankAccountNumber = this.selectedVendor.bankAccountNumber;
        this.paymentProposal.vendorBankAccountType = this.selectedVendor.bankAccountType;
        this.paymentProposal.vendorBankUniqueId = this.selectedVendor.bankUniqueId;
        this.getAllFinanceInvoices();

      }
    });
  }

  getAllFinanceInvoices() {
    this.financeService.getAllFinanceInvoices('details')
      .then((results: any) => {
        if (results && results.financeInvoices) {
          //alert(JSON.stringify(results.financeInvoices));
          this.financeInvoiceList = results.financeInvoices;
          let paymentProposalDetailsLocal: Array<FinanceModels.PaymentProposalDetail> = new Array<FinanceModels.PaymentProposalDetail>();
          for (let entry of this.financeInvoiceList) {
            if (entry.supplierCode === this.selectedVendor.supplierUniqueNo && entry.statusUpdates[entry.statusUpdates.length-1].status.toLocaleLowerCase() === "posted") {
              
              
              let detail: FinanceModels.PaymentProposalDetail = new FinanceModels.PaymentProposalDetail();
              detail.paymentProposalNumber = this.paymentProposal.paymentProposalNumber;
              detail.proposedPaymentDate = new Date();
              detail.tax = 10; //TODO
              detail.invoiceDate = entry.invoiceDate;
              detail.amount = entry.grossAmount;
              detail.poReferenceNumber = entry.purchaseOrderRefNumber;
              detail.invoiceRefernceNumber = entry.invoiceNumber;
              detail.status = "Posted";
              detail.bankProcessingDate = null;
              detail.selectedInUI = true;
              paymentProposalDetailsLocal.push(detail);
            }
          }
          this.paymentProposal.paymentProposalDetails = paymentProposalDetailsLocal;
          this.calculateTotalAmount();
        }
      });
  }

  calculateTotalAmount(){
    this.totalAmount = 0;
    for (let entry of this.paymentProposal.paymentProposalDetails) {
      if (entry.selectedInUI) {
        this.totalAmount = this.totalAmount + +entry.amount;
      }
    }

  }

  savePaymentProposal(myForm: NgForm) {
    let invoiceSelected: boolean = false;
    
    let paymentProposalDetailsToSave: Array<FinanceModels.PaymentProposalDetail> = new Array<FinanceModels.PaymentProposalDetail>();
    for (let entry of this.paymentProposal.paymentProposalDetails) {
      if (entry.selectedInUI) {
        invoiceSelected = true;
        paymentProposalDetailsToSave.push(entry);
      }
    }

    if (invoiceSelected) {
      this.paymentProposal.createdBy = this.currentUser.name;
      this.paymentProposal.createdDate = new Date();
      this.paymentProposal.paymentProposalDetails = paymentProposalDetailsToSave;

      this.financeService.savePaymentProposal(this.paymentProposal)
        .then((results: any) => {
          this.alertService.success("Payment Proposal created." + this.paymentProposal.paymentProposalNumber);
          this.paymentProposal = new FinanceModels.PaymentProposal();
          this.paymentProposal.proposalDate = new Date();
          this.selectedVendor.name = '';
          this.getUniqueId();
        });
    } else {
      alert('Please select a invoice.')
    }

  }

}
