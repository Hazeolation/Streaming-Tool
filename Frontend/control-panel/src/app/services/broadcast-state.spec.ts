import { TestBed } from '@angular/core/testing';

import { BroadcastState } from './broadcast-state';

describe('BroadcastState', () => {
  let service: BroadcastState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BroadcastState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
