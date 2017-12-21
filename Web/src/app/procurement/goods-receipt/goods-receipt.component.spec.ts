import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsReceiptComponent } from './goods-receipt.component';

describe('GoodsReceiptComponent', () => {
  let component: GoodsReceiptComponent;
  let fixture: ComponentFixture<GoodsReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
