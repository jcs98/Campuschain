import { Component, OnInit } from '@angular/core';
import { sha256 } from 'js-sha256';
import { BlockchainClientService } from '../../services/blockchain-client.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  private pdfFile;
  private adderPublicKey;

  constructor(private blockchainClientService: BlockchainClientService) { }

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
        this.pdfFile = reader.result.toString();
      };
    }
  }

  checkFile(file) {
    if (file.type !== 'application/pdf') {
      alert('File type must be pdf!');
      return false;
    }
    return true;
  }

  async addToBlockchain() {
    if (this.pdfFile) {
      const pdfHash = sha256(this.pdfFile);
      const responseData = await this.blockchainClientService.addData(pdfHash).then((response) => response);

      if (responseData.status === 'Success') {
        //  Insert flash message code
        alert('Document successfully added to blockchain');
      } else {
        //  Insert flash message code for error
        alert(responseData.message);
      }
    } else {
      alert('Please upload a PDF first.');
    }
  }

  async verifyFromBlockchain() {
    if (this.pdfFile && this.adderPublicKey) {
      const pdfHash = sha256(this.pdfFile);

      const transactions = await this.blockchainClientService.getTransactionHistory(this.adderPublicKey)
        .then((response) => response);

      if (transactions === 'Unable to connect to the blockchain, please try again later!') {
        alert(transactions);
      } else {
        let success = false;

        transactions.forEach(tx => {
          const blockchainPdfHash = JSON.parse(tx).message;
          if (pdfHash === blockchainPdfHash) {
            success = true;
          }
        });

        if (success) {
          alert('Verified Successfully!');
        } else {
          alert('Verification unsuccessful');
        }
      }
    } else {
      alert('Upload both file and public key to verify!');
    }
  }

}
