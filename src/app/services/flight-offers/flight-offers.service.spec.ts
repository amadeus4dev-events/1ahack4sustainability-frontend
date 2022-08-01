import { TestBed } from '@angular/core/testing';

import { FlightOffersService } from './flight-offers.service';

describe('FlightOffersService', () => {
  let service: FlightOffersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightOffersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
