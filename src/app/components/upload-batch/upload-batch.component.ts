import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
// import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';

@Component({
  selector: 'app-upload-batch',
  templateUrl: './upload-batch.component.html',
  styleUrls: ['./upload-batch.component.scss']
})
export class UploadBatchComponent implements OnInit {
  private rows;

  constructor(private papa: Papa) { }

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
        // console.log(csv);
        this.papa.parse(csv, {
          skipEmptyLines: true,
          complete: (result) => {
            // console.log('Parsed: ', result.data);
            this.rows = result.data;
            // create merkle root
            this.downloadCertis(result.data);
          }
        });
      };
    }
  }

  downloadCertis(rows) {
    const zip = new JSZip();

    rows.forEach(row => {
      const student: any = {};
      student.cpi = row[2].toString();
      student.name = row[1].toString();
      student.year = row[3].toString();
      student.studentId = row[0].toString();
      student.merklePath = ''; // get merkle path
      zip.file(student.studentId + '.json', JSON.stringify(student));
    });

    zip.generateAsync({ type: 'blob' })
      .then((content) => {
        saveAs(content, 'Students' + new Date().getTime() + '.zip');
      });
  }

}
