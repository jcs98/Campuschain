import { Injectable } from '@angular/core';
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

  constructor() {
    this.ec = new EC('p256');
    this.keyEncoder = new KeyEncoder(encoderOptions);
  }

  generateKeyPair(): any {
    const keyPair = this.ec.genKeyPair();
    return this.storeAndGetKeys(keyPair);
  }

  importKeysFromPrivate(priv: string): any {
    const keyPair = this.ec.keyFromPrivate(priv);
    return this.storeAndGetKeys(keyPair);
  }

  storeAndGetKeys(keyPair: any): any {
    const privateKey = keyPair.getPrivate('hex');
    const publicKey = this.getPEMPublicKey(keyPair);
    const keys = { publicKey, privateKey };
    this.storeKeys(keys);
    return keys;
  }

  getPEMPublicKey(keyPair: any): string {
    const rawPublicKey = keyPair.getPublic().encode('hex');
    const pemPublicKey = this.keyEncoder.encodePublic(rawPublicKey, 'raw', 'pem');

    const lines = pemPublicKey.split('\n');
    const publicKey = lines[1] + lines[2];
    return publicKey;
  }

  storeKeys(keys: any) { }

  getPublicKey(): string {
    return '';
  }

  getPrivateKey(): string {
    return '';
  }

  sign(tx: string): string {
    const msgHash = sha256(tx);
    const privateKey = this.getPrivateKey();
    const keyPair = this.ec.keyFromPrivate(privateKey);
    const signature = keyPair.sign(msgHash);
    const sig = '[' + signature.r.toString() + ', ' + signature.s.toString() + ']';
    return sig;
  }

  setPin(pin: string) {
    // store pin hash
  }

  checkPin(pin: string): boolean {
    return true;
  }

}
