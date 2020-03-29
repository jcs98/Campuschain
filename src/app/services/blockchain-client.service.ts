import { Injectable } from '@angular/core';
import { WalletService } from '../services/wallet.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NUMBER_TYPE } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class BlockchainClientService {
  blockchainServerMakeTransaction = '/makeTransaction';
  blockchainServerSendTransaction = '/sendTransaction';
  blockchainServerTransactionHistory = '/transactionHistory';
  blockchainServerCheckBalance = '/checkBalance';
  blockchainBurnAccountPublicKey = `MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEmoylu2ohWpnsOlGXB+
  yZkQzMQnSqfH00o4lfVWSEzJG8mlIiZM+gdRo6trGyCDWv5rRScmp/yEz6RcDNk9t5CQ==`;
  blockchainBurnAmount = '1';
  sendThis: any;
  signThis: any;

  constructor(private walletService: WalletService, private http: HttpClient) { }

  async addDataToBlockchain(makeTransactionRequestData) {
    const responseData = {
      status: 'Error',
      message: 'Unable to connect to the blockchain, please try again later.'
    };

    await this.http
      .post(this.blockchainServerMakeTransaction, makeTransactionRequestData)
      .toPromise()
      .then(
        async (makeTransactionResponse: any) => {
          const sendTransactionRequestData = {
            transaction: makeTransactionResponse.send_this,
            signature: this.walletService.sign(makeTransactionResponse.sign_this)
          };

          await this.http
            .post(this.blockchainServerSendTransaction, sendTransactionRequestData, { responseType: 'text' })
            .toPromise()
            .then((sendTransactionResponse) => {
              if (sendTransactionResponse === 'Done') {
                responseData.status = 'Success';
                responseData.message = 'Added data to the blockchain.';
              }
            },
              (error) => {
                responseData.message = 'Unable to send transaction to the blockchain, please try again later.';
              });
        },
        (error) => {
          // Error
          if (error.status === 400) {
            if (error.error.includes('Insufficient Balance to make Transaction')) {
              responseData.message = error.error;
            } else if (error.error.includes('Invalid Receiver Public Key')) {
              responseData.message = error.error;
            } else if (error.error.includes('Cannot send money to youself')) {
              responseData.message = 'Use another account to add data to the blockchain, cannot send money to oneself.';
            }
          }
        }
      );

    return responseData;
  }

  async addData(data) {
    let makeTransactionRequestData = {
      receiver_public_key: this.blockchainBurnAccountPublicKey,
      sender_public_key: '',
      message: data,
      bounty: this.blockchainBurnAmount
    };

    const responseData = {
      status: '',
      message: ''
    };

    if (this.walletService.getPublicKey()) {
      makeTransactionRequestData.sender_public_key = this.walletService.getPublicKey();

      // create transaction and add to blockchain
      await this.addDataToBlockchain(makeTransactionRequestData)
        .then((response) => {
          responseData.status = response.status;
          responseData.message = response.message;
        });

    } else {
      responseData.status = 'Error';
      responseData.message = 'No keys found to sign transaction, please add a key pair first!';
    }

    return responseData;
  }

  async sendCoins(receiverPublicKey, amount, message) {
    const makeTransactionRequestData = {
      receiver_public_key: receiverPublicKey,
      sender_public_key: '',
      message: message,
      bounty: amount
    };

    const responseData = {
      status: '',
      message: ''
    };

    if (this.walletService.getPublicKey()) {
      makeTransactionRequestData.sender_public_key = this.walletService.getPublicKey();

      // create transaction and add to blockchain
      await this.addDataToBlockchain(makeTransactionRequestData)
        .then((response) => {
          responseData.status = response.status;
          responseData.message = response.message;
        });

    } else {
      responseData.status = 'Error';
      responseData.message = 'No keys found to send coins, please add a key pair first!';
    }

    return responseData;
  }

  async getBalance(publicKey) {
    const balanceRequestData = {
      public_key: publicKey
    };

    const balanceData = { 
      balance: 0,
      message: ''
    };

    await this.http
      .post(this.blockchainServerCheckBalance, balanceRequestData)
      .toPromise()
      .then((res) => {
        balanceData.balance = res;
        balanceData.message = 'Success';
      },
        (error) => {
          balanceData.message = 'Unable to fetch balance, please try again.';
        }
      );

    return balanceData;
  }

  async getTransactionHistory(adderPublicKey) {
    const transactionHistoryRequestData = {
      public_key: adderPublicKey
    };

    let transactionHistory: any;

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

    return transactionHistory;
  }

}
