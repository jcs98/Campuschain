import { Injectable } from '@angular/core';
import { WalletService } from '../services/wallet.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BlockchainClientService {

  blockchainServerUrl: string = 'http://0.0.0.0:';
  blockchainServerPort: string = '9000';
  blockchainServerMakeTransaction: string = '/makeTransaction';
  blockchainServerSendTransaction: string = '/sendTransaction';
  blockchainBurnAccountPublicKey: string = 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE3s5Iqp9VzlL7ngLfR2xb1RIGfuo+siL/zaZdeFblI8pnU5SpJCFEEMZDQBnEEPIOz9bv9lK46AwV3vLcN1VpCA==';
  blockchainBurnAmount: string = '5';

  constructor(private walletService: WalletService, private http: HttpClient) { }

  addData(data) {
    let httpHeaders = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });

    var requestData = {
      method: 'POST',
      url: `${this.blockchainServerUrl}${this.blockchainServerPort}${this.blockchainServerMakeTransaction}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        "receiver_public_key": this.blockchainBurnAccountPublicKey,
        "sender_public_key": this.walletService.getPublicKey(),
        "message": data,
        "bounty": this.blockchainBurnAmount
      },
      options: {
        headers: httpHeaders
      }
    }

    this.http
      .post(requestData.url, requestData.data, requestData.options)
      .toPromise()
      .then((res: any) => {
        console.log(res)
      },
        err => {
          // Error
          console.log(err);
        }
      );

    if (this.walletService.getPublicKey()) {
      const sign = this.walletService.sign(data);
      // create transaction and add to blockchain
    } else {
      alert('No keys found to sign transaction, please add a key pair first!');
    }
  }

  getMerkleRootStored(adderPublicKey) {
    // get all transactions for adderPublicKey and verify if data exists in any of them
    return true;
  }
}
