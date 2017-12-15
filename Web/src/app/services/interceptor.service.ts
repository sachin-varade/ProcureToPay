import { Injectable, Inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { DOCUMENT } from '@angular/platform-browser';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Injectable()
export class InterceptorService implements HttpInterceptor  {
  showLoader: boolean = false;
  constructor(@Inject(DOCUMENT) private document,
  private spinnerService: Ng4LoadingSpinnerService) {
    console.log("interceptor");
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //console.log('processing request', request);
    // add a custom header
    const customReq = request.clone({
      headers: request.headers.set('app-language', 'it')
    });

    // pass on the modified request object
    return next
    .handle(customReq)
    .do((ev: HttpEvent<any>) => {
      if (ev instanceof HttpResponse) {
        //this.document.getElementById('req_loader').css('display','block');        
        //console.log('processing response', ev);
      }
      if(ev.type == 0){
        if(!this.showLoader){
          console.log('show');
          this.showLoader = true;
          this.spinnerService.show();  
        }        
      }
      else if(ev.type == 4){
        if(this.showLoader){
          console.log('hide');
          this.showLoader = false;
          this.spinnerService.hide();
        }
      }
    })
    .catch(response => {
      if (response instanceof HttpErrorResponse) {
        console.log('Processing http error', response);
      }
      if(this.showLoader){
        console.log('catch');
        this.showLoader = false;
        this.spinnerService.hide();
      }      
      return Observable.throw(response);
    });
  }

  

}
