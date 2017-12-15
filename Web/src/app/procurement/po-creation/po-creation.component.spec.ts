import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoCreationComponent } from './po-creation.component';

describe('PoCreationComponent', () => {
  let component: PoCreationComponent;
  let fixture: ComponentFixture<PoCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
