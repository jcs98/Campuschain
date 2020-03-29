import { Component, OnInit } from '@angular/core';
import { MerkleService } from '../../services/merkle.service';
import { Papa } from 'ngx-papaparse';
import * as html2pdf from 'html2pdf.js';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';

const certiPdfOptions = {
  margin: [0, 0],
  filename: 'certi.pdf',
  image: { type: 'jpg' },
  html2canvas: {},
  jsPDF: { orientation: 'landscape' },
};

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss']
})
export class CertificatesComponent implements OnInit {
  private imageSrc: string;
  private rows: any;
  private certiName: string;
  private certiFor: string;
  private certiSign: string;

  constructor(private papa: Papa, private merkleService: MerkleService) { }

  ngOnInit() {
  }

  parseTemplateFile(files: FileList) {
    if (files && files.length > 0) {
      const file = files.item(0);

      if (!this.checkFile(file, 'image/jpeg')) {
        // clear files here
        return;
      }

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  parseCsvFile(files: FileList) {
    if (files && files.length > 0) {
      const file = files.item(0);
      if (!this.checkFile(file, 'text/csv')) {
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

  checkFile(file, fileType) {
    if (file.type !== fileType) {
      alert('File type must be ' + fileType);
      return false;
    }
    return true;
  }

  generateCertificates() {
    const zip = new JSZip();

    this.rows.forEach(row => {
      this.certiName = row[0].toString();
      this.certiFor = row[1].toString();
      this.certiSign = this.getSign(row);
      const content: Element = document.getElementById('certi-holder');

      zip.file(
        this.certiName + '.pdf',
        html2pdf()
          .from(content)
          .set(certiPdfOptions)
          .output('blob')
      );

    });

    zip.generateAsync({ type: 'blob' })
      .then((contents) => {
        saveAs(contents, 'Certificates' + new Date().getTime() + '.zip');
      });
  }

  getSign(row) {
    return row.toString();
  }

}
