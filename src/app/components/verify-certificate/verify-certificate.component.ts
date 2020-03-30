import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-verify-certificate',
  templateUrl: './verify-certificate.component.html',
  styleUrls: ['./verify-certificate.component.scss']
})
export class VerifyCertificateComponent implements OnInit {
  private name;
  private certiFor;
  private signature;
  private adderPublicKey;

  constructor(private walletService: WalletService) { }

  ngOnInit() {
  }

  verifySign() {
    if (this.walletService.verifySign(this.name + this.certiFor, this.signature, this.adderPublicKey)) {
      alert('Signature verified successfully!');
    } else {
      alert('Invalid Signature');
    }
  }

}
