import { Injectable } from '@angular/core';

@Injectable()
export class FileParsingService {

  private rowSeparator = "\n";
  private colSeparator = ";";
  private headerRows = 1;
  private fileRows: FileRow[] = [];

  constructor() { }

  parseFile(file: File): void {
    this.fileRows = [];
    var reader = new FileReader();
    reader.onload = e => {
      var fileContent = e.target.result;
      var rows = fileContent.toString().split(this.rowSeparator);
      rows.forEach((row, i) => {
        if (i >= this.headerRows) {
          var cols = row.split(this.colSeparator);
          this.fileRows.push(new FileRow(i + 1, cols));
        }
      });
    };
    reader.readAsText(file);
  }

  getFileRows(): FileRow[] {
    return this.fileRows;
  }

}

export class FileRow {
  rowNo: number;
  columns: string[];

  constructor(rowNo: number, columns: string[]) {
    this.rowNo = rowNo;
    this.columns = columns;
  }
}