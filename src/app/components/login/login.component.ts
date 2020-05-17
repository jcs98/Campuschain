import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { WalletService } from '../../services/wallet.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private keys: any;
  private importSecretPhrase: string;

  private inputSecretPhrase: string;
  private encryptedMessage: string;

  constructor(private walletService: WalletService, private aesEncryptionService: AesEncryptionService) { }

  ngOnInit() { }

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
        this.encryptedMessage = reader.result.toString();
      };
    }
  }

  checkFile(file) {
    if (file.type !== 'text/plain') {
      alert('File type must be txt !');
      return false;
    }
    return true;
  }

  importKeys() {
    const decryptedText = CryptoJS.AES.decrypt(this.encryptedMessage.trim(), this.importSecretPhrase.trim()).toString(CryptoJS.enc.Utf8); 
    const credentials = JSON.parse(decryptedText);

    this.keys = this.walletService.importKeysFromPrivate(credentials.Private_Key);
    this.updateKeys();
  }

  generateKeys() {
    this.keys = this.walletService.generateKeyPair();
  }

  updateKeys() {
    this.walletService.storeKeys(this.keys);
  }

  copyPublicKey(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 999999);
  }

  copyPrivateKey(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 999999);
  }

  downloadKeys() {
    const privateKey = this.walletService.getPrivateKey();
    const publicKey = this.walletService.getPublicKey();

    const credentials1: any = {};
    credentials1.Public_Key = publicKey;
    credentials1.Private_Key = privateKey;

    const encryptedCredentials = CryptoJS.AES.encrypt(JSON.stringify(credentials1).trim(), this.inputSecretPhrase.trim()).toString();
    const blob = new Blob([encryptedCredentials], {
      type: 'text/plain;charset=utf-8'
    });

    saveAs(blob, 'credentials.txt');

    this.inputSecretPhrase = '';
  }

}
