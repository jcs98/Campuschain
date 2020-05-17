import { Component, ViewChild, ViewEncapsulation, OnInit, AfterViewInit, ViewChildren } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';
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
  private cameraButtonClicked: boolean;
  private displayProperty = 'none';

  constructor(private walletService: WalletService) { }

  @ViewChild(QrScannerComponent, {static: false}) qrScannerComponent: QrScannerComponent;
  
  ngAfterViewInit() {
    qrScannerComponent: QrScannerComponent;
  }

  ngOnInit() { }

  verifySign() {
    if (this.walletService.verifySign(this.name + this.certiFor, this.signature, this.adderPublicKey)) {
      alert('Signature verified successfully!');
    } else {
      alert('Invalid Signature');
    }
  }

  getPublicFromCamera() {
    this.cameraButtonClicked = true;
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
      this.signature = result;
      this.displayProperty = 'none';
    });
  }

}
