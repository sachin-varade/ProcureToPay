import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoDashboardComponent } from './po-dashboard.component';

describe('PoDashboardComponent', () => {
  let component: PoDashboardComponent;
  let fixture: ComponentFixture<PoDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
