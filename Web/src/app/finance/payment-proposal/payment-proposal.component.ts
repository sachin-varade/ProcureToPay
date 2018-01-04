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
    this.getAllFinanceInvoices();

  }

  ngOnInit() {
  }

  getUniqueId() {
    this.financeService.getUniqueId('payment-proposal') //TODO : to be changed
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
      }
    });
  }

  getAllFinanceInvoices() {
    this.financeService.getAllFinanceInvoices('details')
      .then((results: any) => {
        if (results && results.financeInvoices) {
          //alert(JSON.stringify(results.financeInvoices));
          this.financeInvoiceList = results.financeInvoices;
        }
      });
  }

  savePaymentProposal(myForm: NgForm) {
    this.paymentProposal.createdBy = this.currentUser.name;
    this.paymentProposal.createdDate = new Date();

    let paymentProposalDetailsLocal : Array<FinanceModels.PaymentProposalDetail> = new Array<FinanceModels.PaymentProposalDetail>();
    
    for (let entry of this.financeInvoiceList) {
      let detail: FinanceModels.PaymentProposalDetail = new FinanceModels.PaymentProposalDetail();
      detail.paymentProposalNumber = this.paymentProposal.paymentProposalNumber;
      detail.proposalDate = this.paymentProposal.proposalDate;
      detail.tax = 10; //TODO
      detail.amount = entry.grossAmount;
      detail.poReferenceNumber = entry.purchaseOrderRefNumber;
      detail.invoiceRefernceNumber = entry.invoiceNumber;
      detail.status = "Posted";
      detail.bankProcessingDate = this.paymentProposal.proposalDate; //TODO
      paymentProposalDetailsLocal.push(detail);
    }

    this.paymentProposal.paymentProposalDetails = paymentProposalDetailsLocal;

    this.financeService.savePaymentProposal(this.paymentProposal)
      .then((results: any) => {
        this.alertService.success("Payment Proposal created." + this.paymentProposal.paymentProposalNumber);
      });

  }

}
