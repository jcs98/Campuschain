import { Component, OnInit } from '@angular/core';
import { MerkleService } from '../../services/merkle.service';
import { sha3_256 as sha3256 } from 'js-sha3';
import { BlockchainClientService } from '../../services/blockchain-client.service';

@Component({
  selector: 'app-verify-leaf',
  templateUrl: './verify-leaf.component.html',
  styleUrls: ['./verify-leaf.component.scss']
})
export class VerifyLeafComponent implements OnInit {

  private leafData;
  private adderPublicKey;

  constructor(private merkleService: MerkleService, private blockchainClientService: BlockchainClientService) { }

  ngOnInit() {
  }

  parseFile(files: FileList) {
    if (files && files.length > 0) {
      const file = files.item(0);
      if (!this.checkFile(file)) {
        // clear files here
        return;
      }

      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = (e) => {
        this.leafData = JSON.parse(reader.result as string);
      };
    }
  }

  checkFile(file) {
    if (file.type !== 'application/json') {
      alert('File type must be json !');
      return false;
    }
    return true;
  }

  _isHex(value) {
    const hexRegex = /^[0-9A-Fa-f]{2,}$/;
    return hexRegex.test(value);
  }

  async verifyFromBlockchain() {
    const data = this.leafData;

    const transactions = await this.blockchainClientService.getTransactionHistory(this.adderPublicKey)
      .then((response) => response);

    if (transactions === 'Unable to connect to the blockchain, please try again later!') {
      alert(transactions);
    } else {
      let success = false;

      transactions.forEach(tx => {
        const blockchainMerkleRoot = JSON.parse(tx).message;

        const leafNodeData = data.studentId + data.name + data.cpi + data.year + data.college;

        if (this._isHex(blockchainMerkleRoot)) {
          const validRoot = this.merkleService.getRootFromLeaf(data.merklePath, sha3256(leafNodeData), blockchainMerkleRoot);

          if (validRoot) {
            success = true;
          }
        }
      });

      if (success) {
        alert('Verified Successfully!');
      } else {
        alert('Verification unsuccessful');
      }
    }
  }

}
