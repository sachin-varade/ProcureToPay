import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { UserService } from '../services/user.service';
import { BlockService } from '../services/block.service';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BlockComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  blockList: Array<any> = new Array<any>();
  block: any;
  constructor(private user: UserService,
    private blockService: BlockService) { 
      this.currentUser = this.user.getUserLoggedIn();
      this.userData = this.user.getUserData();
      this.commonData = this.user.getCommonData();    
      this.blockService.getRecentBlocks(-1)
      .then((results: any) => {
        this.blockList = results;
      }); 
    }

  ngOnInit() {
  }
  populateDetails(blockNumber){
    this.block = this.blockList.filter(function(o){return o.blockNumber === blockNumber})[0];
  }
}
