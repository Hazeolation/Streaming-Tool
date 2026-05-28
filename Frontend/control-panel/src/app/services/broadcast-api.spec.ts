import { TestBed } from '@angular/core/testing';

import { BroadcastApi } from './broadcast-api';

describe('BroadcastApi', () => {
  let service: BroadcastApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BroadcastApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
