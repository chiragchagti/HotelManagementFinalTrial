import { TestBed } from '@angular/core/testing';

import { ActivateguardService } from './activateguard.service';

describe('ActivateguardService', () => {
  let service: ActivateguardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivateguardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
