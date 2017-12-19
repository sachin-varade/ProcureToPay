import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoTrackerComponent } from './po-tracker.component';

describe('PoTrackerComponent', () => {
  let component: PoTrackerComponent;
  let fixture: ComponentFixture<PoTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
