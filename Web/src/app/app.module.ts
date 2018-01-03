import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardGuard } from './authguard.guard';
import { UserService } from './services/user.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {HttpModule} from '@angular/http';

import { BlockService } from './services/block.service';
import { DialogComponent } from './dialog/dialog/dialog.component';

import { BlockComponent } from './block/block.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { AlertComponent } from './alert/alert.component';
import { AlertService } from './services/alert.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { InterceptorService } from "./services/interceptor.service";
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { PoCreationComponent } from './procurement/po-creation/po-creation.component';
import { ProcurementService } from './services/procurement.service';
import { LogisticService } from './services/logistic.service';
import { VendorService } from './services/vendor.service';
import { FinanceService } from './services/finance.service';
import { BankService } from './services/bank.service';

import { PoFulfilmentComponent } from './vendor/po-fulfilment/po-fulfilment.component';
import { PoTrackerComponent } from './procurement/po-tracker/po-tracker.component';
import { CreateConsignmentComponent } from './logistic/create-consignment/create-consignment.component';
import { GoodsReceiptComponent } from './procurement/goods-receipt/goods-receipt.component';
import { InvoiceManagementComponent } from './finance/invoice-management/invoice-management.component';
import { GoodsIssueComponent } from './vendor/goods-issue/goods-issue.component';
import { GenerateInvoiceComponent } from './vendor/generate-invoice/generate-invoice.component';
import { PaymentProposalComponent } from './finance/payment-proposal/payment-proposal.component';

const appRoutes:Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'syngentaProcurementLogin',
    component: LoginComponent
  },
  {
    path: 'syngentaFinanceLogin',
    component: LoginComponent
  },
  {
    path: 'vendorLogin',
    component: LoginComponent
  },
  {
    path: 'logisticLogin',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    canActivate: [AuthguardGuard],
    component: DashboardComponent
  },
  {
    path: 'logistic/dashboard',
    canActivate: [AuthguardGuard],
    component: DashboardComponent
  },
  {
    path: 'block/recent',
    canActivate: [AuthguardGuard],
    component: BlockComponent
  },
  {
    path: 'procurement/create-po',
    canActivate: [AuthguardGuard],
    component: PoCreationComponent
  },
  {
    path: 'procurement/track-po',
    canActivate: [AuthguardGuard],
    component: PoTrackerComponent
  },
  {
    path: 'procurement/goods-receipt',
    canActivate: [AuthguardGuard],
    component: GoodsReceiptComponent
  },
  {
    path: 'finance/invoice-management',
    canActivate: [AuthguardGuard],
    component: InvoiceManagementComponent
  },
  {
    path: 'finance/payment-proposal',
    canActivate: [AuthguardGuard],
    component: PaymentProposalComponent
  },
  {
    path: 'vendor/po-fulfillment',
    canActivate: [AuthguardGuard],
    component: PoFulfilmentComponent
  },
  {
    path: 'vendor/goodsIssue',
    canActivate: [AuthguardGuard],
    component: GoodsIssueComponent
  },
  {
    path: 'vendor/generate-invoice',
    canActivate: [AuthguardGuard],
    component: GenerateInvoiceComponent
  },
  {
    path: 'logistic/create-consignment',
    canActivate: [AuthguardGuard],
    component: CreateConsignmentComponent
  }   
]


@NgModule({
  declarations: [AppComponent, HeaderComponent, LoginComponent, FooterComponent, 
    DashboardComponent, DialogComponent, BlockComponent, AlertComponent, PoCreationComponent, PoFulfilmentComponent, PoTrackerComponent, CreateConsignmentComponent, GoodsReceiptComponent, InvoiceManagementComponent, GoodsIssueComponent, GenerateInvoiceComponent, PaymentProposalComponent],
  imports: [  
  RouterModule.forRoot(appRoutes),
  FormsModule,
  BrowserModule,    
  BsDatepickerModule.forRoot(),
  TimepickerModule.forRoot(),
  NgbModule.forRoot(),
  HttpModule,
  BrowserAnimationsModule,
  NgxQRCodeModule,
  HttpClientModule,
  Ng4LoadingSpinnerModule
  ],
  providers: [UserService, AuthguardGuard, FormsModule, BlockService, AlertService,
    ProcurementService, LogisticService, VendorService, FinanceService, BankService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }