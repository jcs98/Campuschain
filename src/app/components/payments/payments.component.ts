import { Component, OnInit } from '@angular/core';
import { BlockchainClientService } from '../../services/blockchain-client.service';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  private balance = 0;

  private publicKey;

  private amount;
  private message;
  private receiverPublicKey;


  constructor(private walletService: WalletService, private blockchainClientService: BlockchainClientService) { }

  ngOnInit() {
    this.getBalance();
  }

  async sendCoins() {
    const transactionResponse = await this.blockchainClientService.sendCoins(this.receiverPublicKey, this.amount, this.message).then((response) => { return response });

    console.log(transactionResponse);

    if (transactionResponse.status === 'Success') {
      //  Insert flash message code
      alert('Coins successfully sent!')
    } else {
      //  Insert flash message code for error
      alert(transactionResponse.message);
    }
  }

  async getBalance() {
    if (this.walletService.getPublicKey()) {
      this.publicKey = this.walletService.getPublicKey();

      const balanceResponseData = await this.blockchainClientService.getBalance(this.walletService.getPublicKey()).then((response) => { return response });

      if (balanceResponseData.message === 'Success') {
        this.balance = balanceResponseData.balance;
      } else {
        alert(balanceResponseData.message)
      }
    } else {
      alert('Please add a key pair before proceeding');
    }
  }

  copyPublicKey(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 999999);
  }

}
