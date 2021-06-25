import { Component } from "@angular/core";
import { FileParsingService, FileRow } from "./file-parsing.service";
import moment from 'moment';

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  exchangeRates: ExchangeRate[] = [];
  fileRows: FileRow[] = [];
  invalidRows: FileRow[] = [];

  constructor(private fileParsingService: FileParsingService) {}

  handleUpload($event: any) {
    this.fileRows = [];
    this.exchangeRates = [];
    this.invalidRows = [];

    var file = $event.target.files[0];
    this.fileParsingService.parseFile(file);
    this.fileRows = this.fileParsingService.getFileRows();
  }

  createMyEntities() {
    this.exchangeRates = [];
    this.invalidRows = [];
    this.fileRows.forEach(fileRow => {
      var exchangeRateParser = new ExchangeRateParser(
        fileRow.columns[0],
        fileRow.columns[1],
        fileRow.columns[2]
      );
      var exchangeRate = exchangeRateParser.parse();

      if (exchangeRate) {
        this.exchangeRates.push(exchangeRate);
      } else {
        this.invalidRows.push(new FileRow(fileRow.rowNo, fileRow.columns));
      }
    });
  }
}

export class ExchangeRate {
  id: number;
  rateDate: Date;
  rate: number;
  currencyCode: CurrencyCode;

  constructor(rateDate: Date, rate: number, currencyCode: CurrencyCode) {
      this.rateDate = rateDate;
      this.rate = rate;
      this.currencyCode = currencyCode;
  }
}

export class ExchangeRateParser {
  rateDate: string;
  rate: string;
  currencyCode: string;

  constructor(rateDate: string, rate: string, currencyCode: string) {
      this.rateDate = rateDate;
      this.rate = rate;
      this.currencyCode = currencyCode;
  }

  parse(): ExchangeRate {
    const DATE_TIME_FORMAT = 'D.M.YYYY';    
    var rateDate = moment(this.rateDate, DATE_TIME_FORMAT).toDate();
    /*if (isNaN(rateDate)) {
      return null;
    }*/
    var rate = parseFloat(this.rate.replace(',', '.'));
    if (isNaN(rate) || rate <= 0) {
      return null;
    }
    var currencyCode = new CurrencyCode(this.currencyCode,"",0);
    return new ExchangeRate(rateDate, rate, currencyCode);
  }
}

export class CurrencyCode {
  id: number;
  currencyCode: string;
  country: string;
  rateQty: number;

  constructor(currencyCode: string, country: string, rateQty: number) {
    this.currencyCode = currencyCode;
    this.country = country;
    this.rateQty = rateQty;
  }
}