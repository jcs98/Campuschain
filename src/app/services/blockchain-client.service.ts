import { Injectable } from '@angular/core';
import { WalletService } from '../services/wallet.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BlockchainClientService {
  blockchainServerMakeTransaction: string = '/makeTransaction';
  blockchainServerSendTransaction: string = '/sendTransaction';
  blockchainServerTransactionHistory:string = "/transactionHistory";
  blockchainBurnAccountPublicKey: string = 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE3s5Iqp9VzlL7ngLfR2xb1RIGfuo+siL/zaZdeFblI8pnU5SpJCFEEMZDQBnEEPIOz9bv9lK46AwV3vLcN1VpCA==';
  blockchainBurnAmount: string = '5';
  sendThis: any;
  signThis: any;

  constructor(private walletService: WalletService, private http: HttpClient) { }

  async addDataToBlockchain(makeTransactionRequestData) {
    var success = false;

    await this.http
    .post(this.blockchainServerMakeTransaction, makeTransactionRequestData)
    .toPromise()
    .then(
      async(makeTransactionResponse) =>  {
        const sendTransactionRequestData = {
            "transaction": makeTransactionResponse.send_this,
            "signature": this.walletService.sign(makeTransactionResponse.sign_this)
        }

        await this.http
          .post(this.blockchainServerSendTransaction, sendTransactionRequestData, { responseType: 'text' })
          .toPromise()
          .then((sendTransactionResponse) => {
            if(sendTransactionResponse == "Done") {
              success = true;
            }
          },
            (error) => {
              console.log(error)
            })
      },
      (error) => {
        // Error
        console.log("err", error);
      }
    );
    
    return success;
  }

  async addData(data) {
    const makeTransactionRequestData = {
      "receiver_public_key": this.blockchainBurnAccountPublicKey,
      "sender_public_key": this.walletService.getPublicKey(),
      "message": data,
      "bounty": this.blockchainBurnAmount
    }

    let success:boolean = false;

    if (this.walletService.getPublicKey()) {
      // create transaction and add to blockchain
      await this.addDataToBlockchain(makeTransactionRequestData)
      .then((response) => {
        success = response;
      })

    } else {
      alert('No keys found to sign transaction, please add a key pair first!');
    }

    return success
  }

  async getBlockchainTransactionHistory(transactionHistoryRequestData) {
    var transactionHistory: any;

    await this.http
    .post(this.blockchainServerTransactionHistory, transactionHistoryRequestData)
    .toPromise()
    .then((res) => {
      transactionHistory = res;
    },
      (error) => {
        console.log(error);
      }
    );

    return transactionHistory
  }

  async getMerkleRootStored(adderPublicKey) {
    const transactionHistoryRequestData = {
      "public_key": adderPublicKey
    }
    
    var transactionHistory: any;

    await this.getBlockchainTransactionHistory(transactionHistoryRequestData)
    .then((response) => {
      transactionHistory = response;
    })
    return transactionHistory;
  }
  
}
