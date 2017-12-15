import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../user.service';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userLoggedId: boolean = false;
  companyLogoImagePath: string;
  currentUser: any;
  theme: string = "";
  constructor(private router:Router, private user:UserService,
    @Inject(DOCUMENT) private document) {
    this.userLoggedId = this.user.isUserLoggedIn() === "true" ? true : false;
    this.currentUser = this.user.getUserLoggedIn();
  }

  ngOnInit() {
  }

  logout(){    
    var role = "";
    role = this.currentUser.role;

    this.user.logout();
    this.userLoggedId = this.user.isUserLoggedIn() === "true" ? true : false;

    if (role == "procurement") {
      this.router.navigate(['/syngentaProcurementLogin']);
    } else if (role == "finance") {
      this.router.navigate(['/syngentaFinanceLogin']);
    } else if (role == "vendor") {
      this.router.navigate(['/vendorLogin']);
    } else if (role == "logistic") {
      this.router.navigate(['/logisticLogin']);
    } else if (role == "bank") {
      this.router.navigate(['/syngentaFinanceLogin']);
    }
    else{
      this.router.navigate(['']);
    }
  }

  getUser(){
    this.currentUser = this.user.getUserLoggedIn();
    if(this.currentUser){
      this.theme = "../../assets/themes/theme-"+ this.currentUser.role +".css";
      this.document.getElementById('theme').setAttribute('href', this.theme);
      this.document.getElementById('companyLogoImg').setAttribute('src', "../../assets/images/"+ this.currentUser.role +"-logo.png");
      return this.currentUser;
    }
    else{      
      return "";
    }
  }
}