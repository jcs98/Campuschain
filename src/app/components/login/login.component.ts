import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private keys: any;
  private inputPrivateKey: string;

  constructor(private walletService: WalletService) { }

  ngOnInit() { }

  importKeys() {
    if (this.inputPrivateKey) {
      this.keys = this.walletService.importKeysFromPrivate(this.inputPrivateKey);
    }
  }

  generateKeys() {
    this.keys = this.walletService.generateKeyPair();
  }

  updateKeys() {
    this.walletService.storeKeys(this.keys);
  }

}
