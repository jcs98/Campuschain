import { Injectable } from '@angular/core';
const MerkleTools = require('merkle-tools');

const treeOptions = {
  hashType: 'SHA3-256'
};

@Injectable({
  providedIn: 'root'
})

export class MerkleService {
  private merkleTools: any;
  private doHash: boolean;
  private merkleRoot: any;

  constructor() {
    this.merkleTools = new MerkleTools(treeOptions);
    this.doHash = true;
  }

  getMerkleTreeRoot(rows) {
    rows.forEach(studentRecord => {
      let studentRecordData = '';

      studentRecord.forEach(studentData => {
        studentRecordData += studentData;
      });

      this.merkleTools.addLeaf(studentRecordData, this.doHash);
    });

    this.merkleTools.makeBTCTree(this.doHash);

    if (this.merkleTools.getTreeReadyState()) {
      this.merkleRoot = this.merkleTools.getMerkleRoot();

      // Conversion from Uint8 to Hex format
      this.merkleRoot = Buffer.from(this.merkleRoot).toString('hex');

      return this.merkleRoot;
    }

  }

  getMerklePath(index: number) {
    return this.merkleTools.getProof(index);
  }

  getLeaf(index: number) {
    return this.merkleTools.getLeaf(index).toString('hex');
  }

  getRootFromLeaf(merklePath, data, merkleRoot) {
    return this.merkleTools.validateProof(merklePath, data, merkleRoot, this.doHash);
  }
}
