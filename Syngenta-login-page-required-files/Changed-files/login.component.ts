import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-logistic.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage: string = "";
  constructor(private router:Router, private user:UserService) { 
    if(this.user.isUserLoggedIn() === "true"){
      this.router.navigate(['dashboard']);
    }
  }

  ngOnInit() {
  }

  loginUser(e) {
  	e.preventDefault();
  	console.log(e);
  	var username = e.target.elements[0].value;
  	var password = e.target.elements[1].value;
    if(this.user.login({userName: username, password: password})){
        this.errorMessage = '';
        this.user.setUserLoggedIn();
        this.router.navigate(['dashboard']);
        this.user.getUserData();
        this.user.getCommonData();
    }
    
    
    // .then((results) => {
    //   if(results._body.indexOf("Error") > -1){
    //     this.errorMessage = results._body;
    //     return;
    //   }
    //   else {
    //     this.errorMessage = '';
    //     this.user.setUserLoggedIn();
    //     this.router.navigate(['dashboard']);
    //     this.user.getUserData();
    //     this.user.getCommonData();
    //   }
    // }).catch((err) => {
    //     throw err;
    // });
  }
}
