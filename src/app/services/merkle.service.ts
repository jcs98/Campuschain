import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MerkleService {

  constructor() { }

  getMerkleRoot(rows) {}

  getMerklePath(index) {}

  getRootFromLeaf(data, merklePath) {}
}
