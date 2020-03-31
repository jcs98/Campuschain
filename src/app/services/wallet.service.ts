import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ec as EC } from 'elliptic';
import { sha256 } from 'js-sha256';
import KeyEncoder from 'key-encoder';

const encoderOptions = {
  curveParameters: [1, 2, 840, 10045, 3, 1, 7],
  privatePEMOptions: { label: 'EC PRIVATE KEY' },
  publicPEMOptions: { label: 'PUBLIC KEY' },
  curve: new EC('p256')
};

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private ec: EC;
  private keyEncoder: KeyEncoder;

  observablePublicKey = new BehaviorSubject(this.getPublicKey());

  constructor() {
    this.ec = new EC('p256');
    this.keyEncoder = new KeyEncoder(encoderOptions);
  }

  generateKeyPair(): any {
    const keyPair = this.ec.genKeyPair();
    return this.getKeys(keyPair);
  }

  importKeysFromPrivate(priv: string): any {
    const keyPair = this.ec.keyFromPrivate(priv);
    return this.getKeys(keyPair);
  }

  getKeys(keyPair: any): any {
    const privateKey = keyPair.getPrivate('hex');
    const publicKey = this.getPEMPublicKey(keyPair);
    const keys = { publicKey, privateKey };
    return keys;
  }

  getPEMPublicKey(keyPair: any): string {
    const rawPublicKey = keyPair.getPublic().encode('hex');
    const pemPublicKey = this.keyEncoder.encodePublic(rawPublicKey, 'raw', 'pem');

    const lines = pemPublicKey.split('\n');
    const publicKey = lines[1] + lines[2];
    return publicKey;
  }

  storeKeys(keys: any) {
    // check pin if required
    this.observablePublicKey.next(keys.publicKey);
    // encrypt if required
    localStorage.setItem('keys', JSON.stringify(keys));
  }

  getPublicKey(): string {
    const keys = JSON.parse(localStorage.getItem('keys'));
    if (keys) {
      return keys.publicKey;
    }
    return '';
  }

  getPrivateKey(): string {
    // check pin if required
    const keys = JSON.parse(localStorage.getItem('keys'));
    if (keys) {
      return keys.privateKey;
    }
    return '';
  }

  sign(msg: string): string {
    // check pin if required
    const msgHash = sha256(msg);
    const privateKey = this.getPrivateKey();
    const keyPair = this.ec.keyFromPrivate(privateKey);
    const signature = keyPair.sign(msgHash);
    const sig = '[' + signature.r.toString() + ', ' + signature.s.toString() + ']';
    return sig;
  }

  signCertificate(msg: string): string {
    // check pin if required
    const msgHash = sha256(msg);
    const privateKey = this.getPrivateKey();
    const keyPair = this.ec.keyFromPrivate(privateKey);
    const signature = keyPair.sign(msgHash);
    const sig = JSON.stringify(signature);
    return sig;
  }

  verifySign(msg: string, signature: string, publicKey: string): boolean {
    const pemPublicKey = '-----BEGIN PUBLIC KEY-----\n' + publicKey.substring(0, 64) + '\n' + publicKey.substring(64) + '\n-----END PUBLIC KEY-----';

    const rawPublicKey = this.keyEncoder.encodePublic(pemPublicKey, 'pem', 'raw');
    const keyPair = this.ec.keyFromPublic(rawPublicKey, 'hex');
    const validSignature = keyPair.verify(sha256(msg), JSON.parse(signature));
    return validSignature;
  }

  setPin(pin: string) {
    // store pin hash
  }

  checkPin(pin: string): boolean {
    return true;
  }

}
