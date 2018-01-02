import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentProposalComponent } from './payment-proposal.component';

describe('PaymentProposalComponent', () => {
  let component: PaymentProposalComponent;
  let fixture: ComponentFixture<PaymentProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
