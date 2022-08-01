import { TestBed } from '@angular/core/testing';

import { GreenMilesService } from './green-miles.service';

describe('GreenMilesService', () => {
  let service: GreenMilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GreenMilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
