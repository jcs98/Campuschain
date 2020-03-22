import { Component, OnInit } from '@angular/core';
import { MerkleService } from '../../services/merkle.service';
import { Papa } from 'ngx-papaparse';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';

@Component({
  selector: 'app-upload-batch',
  templateUrl: './upload-batch.component.html',
  styleUrls: ['./upload-batch.component.scss']
})
export class UploadBatchComponent implements OnInit {
  private rows;

  constructor(private papa: Papa, private merkleService: MerkleService) { }

  ngOnInit() {
  }

  parseFile(files: FileList) {
    if (files && files.length > 0) {
      const file = files.item(0);
      // console.log(file.type); // can use for type checking safety
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

  addToBlockchain() {
    const merkleRoot = this.merkleService.getMerkleRoot(this.rows);
    // add to blockchain
    this.downloadCertis(this.rows);
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
      zip.file(student.studentId + '.json', JSON.stringify(student));
      index++;
    });

    zip.generateAsync({ type: 'blob' })
      .then((content) => {
        saveAs(content, 'Students' + new Date().getTime() + '.zip');
      });
  }

}