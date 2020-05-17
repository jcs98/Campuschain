import { Component, ViewChild, OnInit } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';
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

  private displayProperty = 'none';


  constructor(private walletService: WalletService, private blockchainClientService: BlockchainClientService) { }

  @ViewChild(QrScannerComponent, {static: false}) qrScannerComponent: QrScannerComponent;
  
  ngAfterViewInit() {
    qrScannerComponent: QrScannerComponent;
  }


  ngOnInit() {
    this.getBalance();
  }

  async sendCoins() {
    const transactionResponse = await this.blockchainClientService.sendCoins(this.receiverPublicKey, this.amount, this.message).then((response) => { return response });

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

  getPublicFromCamera() {
    this.displayProperty = 'block';
    this.qrScannerComponent.getMediaDevices().then(devices => {
      // console.log(devices);
      const videoDevices: MediaDeviceInfo[] = [];
      for (const device of devices) {
        if (device.kind.toString() === 'videoinput') {
          videoDevices.push(device);
        }
      }
      if (videoDevices.length > 0) {
        let choosenDev;
        for (const dev of videoDevices) {
          if (dev.label.includes('front')) {
            choosenDev = dev;
            break;
          }
        }
        if (choosenDev) {
          this.qrScannerComponent.chooseCamera.next(choosenDev);
        } else {
          this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
        }
      }
    });

    this.qrScannerComponent.capturedQr.subscribe(result => {
      this.receiverPublicKey = result;
      this.displayProperty = 'none';
      console.log(this.displayProperty);
    });
  }

}
