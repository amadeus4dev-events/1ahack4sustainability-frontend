import { TestBed } from '@angular/core/testing';

import { WoosmapService } from './woosmap.service';

describe('WoosmapService', () => {
  let service: WoosmapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WoosmapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
