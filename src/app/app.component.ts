import { Component, OnInit } from '@angular/core';
import { WalletService } from './services/wallet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private publicKey: string;
  private sideBarIsActive: boolean;

  constructor(public walletService: WalletService) { }

  ngOnInit() {
    this.walletService.observablePublicKey.subscribe((nextValue) => {
      this.publicKey = nextValue;
    });
  }
}
