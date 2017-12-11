import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../user.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']  
})
export class MenuComponent implements OnInit {
  userLoggedId: boolean = false;
  companyLogoImagePath: string;
  currentUser: any;
  constructor(private router:Router, private user:UserService) {
    this.userLoggedId = this.user.isUserLoggedIn() === "true" ? true : false;
    this.currentUser = this.user.getUserLoggedIn();
  }

  ngOnInit() {
  }

}