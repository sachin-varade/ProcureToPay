import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessPaymentComponent } from './process-payment.component';

describe('ProcessPaymentComponent', () => {
  let component: ProcessPaymentComponent;
  let fixture: ComponentFixture<ProcessPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
