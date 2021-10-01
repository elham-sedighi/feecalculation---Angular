import { TestBed } from '@angular/core/testing';

import { FeeCalculatorService } from './feeCalculator.service';

describe('ConfigService', () => {
  let service: FeeCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeeCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
