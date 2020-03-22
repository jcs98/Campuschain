import { Injectable } from '@angular/core';
import { WalletService } from '../services/wallet.service';

@Injectable({
  providedIn: 'root'
})
export class BlockchainClientService {

  constructor(private walletService: WalletService) { }

  addData(data) {
    if (this.walletService.getPublicKey()) {
      const sign = this.walletService.sign(data);
      // create transaction and add to blockchain
    } else {
      alert('No keys found to sign transaction, please add a key pair first!');
    }
  }

  verifyData(data, adderPublicKey) {
    // get all transactions for adderPublicKey and verify if data exists in any of them
    return true;
  }
}
