import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoFulfilmentComponent } from './po-fulfilment.component';

describe('PoFulfilmentComponent', () => {
  let component: PoFulfilmentComponent;
  let fixture: ComponentFixture<PoFulfilmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoFulfilmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoFulfilmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
