import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoTrackerComponent } from './so-tracker.component';

describe('SoTrackerComponent', () => {
  let component: SoTrackerComponent;
  let fixture: ComponentFixture<SoTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
