import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MerkleService } from '../../services/merkle.service';
import { BlockchainClientService } from '../../services/blockchain-client.service';
import { Papa } from 'ngx-papaparse';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';

@Component({
  selector: 'app-upload-batch',
  templateUrl: './upload-batch.component.html',
  styleUrls: ['./upload-batch.component.scss']
})
export class UploadBatchComponent implements OnInit {
  @ViewChild("uploadText", {static: false}) pUploadText: ElementRef;

  private rows;

  constructor(private papa: Papa, private merkleService: MerkleService, private blockchainClientService: BlockchainClientService) { }

  ngOnInit() {
  }

  parseFile(files: FileList) {
    if (files && files.length > 0) {
      const file = files.item(0);
      if (!this.checkFile(file)) {
        // clear files here
        return;
      }
      this.pUploadText.nativeElement.innerHTML = "1 File selected";
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
      alert('File type must be csv !');
      return false;
    }
    return true;
  }

  async addToBlockchain() {
    const merkleRoot = this.merkleService.getMerkleTreeRoot(this.rows);
    const responseData = await this.blockchainClientService.addData(merkleRoot).then((response)=> {return response});
    
    if(responseData.status == "Success") {
      //  Insert flash message code
      this.downloadCertis(this.rows);
    } else {
      //  Insert flash message code for error
      alert(responseData.message)
    }
  }

  downloadCertis(rows) {
    const zip = new JSZip();

    let index = 0;
    rows.forEach(row => {
      const student: any = {};
      student.cpi = row[2].toString();
      student.name = row[1].toString();
      student.year = row[3].toString();
      student.studentId = row[0].toString();
      student.merklePath = this.merkleService.getMerklePath(index);
      student.leafNode = this.merkleService.getLeaf(index);
      zip.file(student.studentId + '.json', JSON.stringify(student));
      index++;
    });

    zip.generateAsync({ type: 'blob' })
      .then((content) => {
        saveAs(content, 'Students' + new Date().getTime() + '.zip');
      });
  }

}
