import { TestBed } from '@angular/core/testing';

import { TrainItinerariesService } from './train-itineraries.service';

describe('TrainItinerariesService', () => {
  let service: TrainItinerariesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainItinerariesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
