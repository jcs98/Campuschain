import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MerkleService } from '../../services/merkle.service';
import { BlockchainClientService } from '../../services/blockchain-client.service';

@Component({
  selector: 'app-verify-leaf',
  templateUrl: './verify-leaf.component.html',
  styleUrls: ['./verify-leaf.component.scss']
})
export class VerifyLeafComponent implements OnInit {
  @ViewChild('uploadText', { static: false }) pUploadText: ElementRef;

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
      this.pUploadText.nativeElement.innerHTML = '1 File selected';
      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = (e) => {
        this.leafData = reader.result.toString();
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
    const data = JSON.parse(this.leafData);


    const transactions = await this.blockchainClientService.getTransactionHistory(this.adderPublicKey)
      .then((response) => response);

    let success = false;

    transactions.forEach(tx => {
      const blockchainMerkleRoot = JSON.parse(tx).message;
      if (this._isHex(blockchainMerkleRoot)) {
        const validRoot = this.merkleService.getRootFromLeaf(data.merklePath, data.leafNode, blockchainMerkleRoot);

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
