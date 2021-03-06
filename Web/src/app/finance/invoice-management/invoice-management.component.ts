import { Component, OnInit } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';
import { VendorService } from '../../services/vendor.service';
import { FinanceService } from '../../services/finance.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import * as VendorModels from '../../models/vendor';
import * as FinanceModels from '../../models/finance';

@Component({
  selector: 'app-invoice-management',
  templateUrl: './invoice-management.component.html',
  styleUrls: ['./invoice-management.component.css']
})
export class InvoiceManagementComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  financeInvoice: FinanceModels.FinanceInvoice = new FinanceModels.FinanceInvoice();
  vendorInvoiceList: Array<VendorModels.VendorInvoice> = new Array<VendorModels.VendorInvoice>();

  vendorInvoiceStatus : string;

  constructor(private alertService: AlertService,
    private vendorService: VendorService,
    private user: UserService,
  private financeService: FinanceService) {
      this.currentUser = this.user.getUserLoggedIn();
      this.userData = this.user.getUserData();
      this.commonData = this.user.getCommonData();
      this.getAllVendorInvoices();
  }

  getAllVendorInvoices(){
    this.vendorService.getAllVendorInvoices('details')
    .then((results: any) => {
      if(results && results.vendorInvoices){
        this.vendorInvoiceList = results.vendorInvoices;
        this.financeService.getAllFinanceInvoices('details')
        .then((results: any) => {
          if(results && results.financeInvoices){
            this.vendorInvoiceList.forEach(element => {
              var finInvoice = results.financeInvoices.filter(function(o){return o.invoiceNumber === element.invoiceNumber; });
              if(finInvoice && finInvoice.length > 0){
                element.currentStatus = finInvoice[0].currentStatus;
              }
              else{
                element.currentStatus = "Created";
              }
            }); 
          }
          else{
            this.vendorInvoiceList.forEach(element => {
              element.currentStatus = "Created";
            }); 
          }
        });
      }
    });
  }

  selectInvoice(myForm: NgForm){
    if(this.financeInvoice && this.financeInvoice.invoiceNumber){
      this.vendorInvoiceList.forEach(element => {
        if(element.invoiceNumber === this.financeInvoice.invoiceNumber){
          this.vendorInvoiceStatus = element.currentStatus;
          this.financeInvoice = JSON.parse(JSON.stringify(element));
        }
      });
    }
    else{
      this.clearForm(myForm);
      this.financeInvoice.invoiceDate = null;
      this.vendorInvoiceStatus = '';
    }
  }

  ngOnInit() {
  }

  saveInvoice(myForm: NgForm){
    this.financeInvoice.statusUpdates.push(      
      {
        status: "Parked",
        updatedBy: this.currentUser.id,
        updatedOn: new Date()
      }
    );
    this.financeService.saveFinanceInvoice(this.financeInvoice)
    .then((results: any) => { 
      if(results && results.type && results.type === "ERROR"){
        if(results.message.indexOf('message:') > -1){
          this.alertService.error(results.message.replace("(","").replace(")","").split('message:')[1]);
        }
        else{
        this.alertService.error(results.message);
        }
      }      
      else{
        this.getAllVendorInvoices();        
        this.alertService.success("Invoice Saved.");
        this.clearForm(myForm);
      }
    });
  }

  clearForm(myForm: NgForm){
    myForm.resetForm();    
    this.financeInvoice = new VendorModels.VendorInvoice();
    this.vendorInvoiceStatus = '';
    //this.financeInvoice.invoiceDate= new Date();
  }

}
