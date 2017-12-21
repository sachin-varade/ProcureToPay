import { TestBed, inject } from '@angular/core/testing';

import { FinanceService } from './finance.service';

describe('FinanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinanceService]
    });
  });

  it('should be created', inject([FinanceService], (service: FinanceService) => {
    expect(service).toBeTruthy();
  }));
});
