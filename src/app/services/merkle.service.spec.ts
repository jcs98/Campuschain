import { TestBed } from '@angular/core/testing';

import { MerkleService } from './merkle.service';

describe('MerkleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MerkleService = TestBed.get(MerkleService);
    expect(service).toBeTruthy();
  });
});
