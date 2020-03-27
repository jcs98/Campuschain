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
  blockchainBurnAccountPublicKey: string = 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEmoylu2ohWpnsOlGXB+yZkQzMQnSqfH00o4lfVWSEzJG8mlIiZM+gdRo6trGyCDWv5rRScmp/yEz6RcDNk9t5CQ==';
  blockchainBurnAmount: string = '5';
  sendThis: any;
  signThis: any;

  constructor(private walletService: WalletService, private http: HttpClient) { }

  async addDataToBlockchain(makeTransactionRequestData) {
    let responseData = {
      status: "Error",
      message: "Unable to connect to the blockchain, please try again later."
    }

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
              responseData.status = "Success";
              responseData.message = "Added Merkle root to the blockchain."
            }
          },
            (error) => {
              responseData.message = "Unable to send transaction to the blockchain, please try again later."
            }) 
      },
      (error) => {
        // Error
        if(error.status == 400) {
          if(error.error.includes("Insufficient Balance to make Transaction")){
            responseData.message = error.error
          }
          else if (error.error.includes("Invalid Receiver Public Key")) {
            responseData.message = error.error
          }
          else if (error.error.includes("Cannot send money to youself")) {
            responseData.message = "Use another account to add data to the blockchain, cannot send money to oneself."
          }
        }
      }
    );
    
    return responseData
  }

  async addData(data) {
    const makeTransactionRequestData = {
      "receiver_public_key": this.blockchainBurnAccountPublicKey,
      "sender_public_key": this.walletService.getPublicKey(),
      "message": data,
      "bounty": this.blockchainBurnAmount
    }

    let responseData = {
      status: "",
      message: ""
    }

    if (this.walletService.getPublicKey()) {
      // create transaction and add to blockchain
      await this.addDataToBlockchain(makeTransactionRequestData)
      .then((response) => {
        responseData.status = response.status;
        responseData.message = response.message;
      })

    } else {
      responseData.status = "Error";
      responseData.message = "No keys found to sign transaction, please add a key pair first!";
    }

    return responseData
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
