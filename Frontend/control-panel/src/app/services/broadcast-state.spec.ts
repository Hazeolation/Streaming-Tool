import { TestBed } from '@angular/core/testing';

import { BroadcastStateService } from './broadcast-state';

describe('BroadcastStateService', () => {
  let service: BroadcastStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BroadcastStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
