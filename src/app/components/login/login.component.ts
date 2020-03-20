import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private privateKey: string;
  private publicKey: string;
  private inputPrivateKey: string;

  constructor(public walletService: WalletService) { }

  ngOnInit() { }

  importKeys() {
    if (this.inputPrivateKey) {
      const keys = this.walletService.importKeysFromPrivate(this.inputPrivateKey);
      this.publicKey = keys.publicKey;
      this.privateKey = keys.privateKey;
    }
  }

  generateKeys() {
    const keys = this.walletService.generateKeyPair();
    this.publicKey = keys.publicKey;
    this.privateKey = keys.privateKey;
  }

}
