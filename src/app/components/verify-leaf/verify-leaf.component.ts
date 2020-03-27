import { Component, OnInit } from '@angular/core';
import { MerkleService } from '../../services/merkle.service';
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

  _isHex (value) {
    var hexRegex = /^[0-9A-Fa-f]{2,}$/
    return hexRegex.test(value)
  }

  async verifyFromBlockchain() {
    const data = JSON.parse(this.leafData);
    

    const blockchainMerkleRoot = await this.blockchainClientService.getMerkleRootStored(this.adderPublicKey).then((response)=> { return response })
    
    let success = false;

    blockchainMerkleRoot.forEach(blockchainTransaction => {
      const blockchainMerkleRoot = JSON.parse(blockchainTransaction).message;
      if(this._isHex(blockchainMerkleRoot)){
        const validRoot = this.merkleService.getRootFromLeaf(data.merklePath, data.leafNode, blockchainMerkleRoot);
        
        if(validRoot){
          success = true;
        }
      }
    });

    if (success) {
      alert('Verified Successfully !');
    } else {
      alert('Verification unsuccessful');
    }
  }

}
