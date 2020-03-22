import { TestBed } from '@angular/core/testing';

import { BlockchainClientService } from './blockchain-client.service';

describe('BlockchainClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlockchainClientService = TestBed.get(BlockchainClientService);
    expect(service).toBeTruthy();
  });
});
