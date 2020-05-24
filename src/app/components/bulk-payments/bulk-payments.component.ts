import { Component, OnInit } from '@angular/core';
import { BlockchainClientService } from '../../services/blockchain-client.service';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-bulk-payments',
  templateUrl: './bulk-payments.component.html',
  styleUrls: ['./bulk-payments.component.scss']
})
export class BulkPaymentsComponent implements OnInit {
  rows;
  sendIncentivesClicked = false;

  constructor(private papa: Papa, private blockchainClientService: BlockchainClientService) { }

  ngOnInit() {
  }

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
        const csv = reader.result.toString();
        this.papa.parse(csv, {
          skipEmptyLines: true,
          complete: (result) => {
            this.rows = result.data;
          }
        });
      };
    }
  }

  checkFile(file) {
    if (file.type !== 'text/csv') {
      alert('File type must be csv!');
      return false;
    }
    return true;
  }

  async sendCoins(row) {
    const message = 'Assignment Incentive for ' + row[1] + ' to ' + row[0];
    const responseData = await this.blockchainClientService.sendCoins(row[3], row[2], message).then((response) => response);

    if (responseData.status === 'Success') {
      //  Insert flash message code
      row[4] = 'Coins sent!';
    } else {
      //  Insert flash message code for error
      row[4] = responseData.message;
    }
  }

  async sendIncentives() {
    this.sendIncentivesClicked = true;
    for (const row of this.rows) {
      this.sendCoins(row);
    }
  }


}
