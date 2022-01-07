import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProjectService } from '@app/data/service/project.service';
import { DestroyComponent } from '@app/shared/component/destroy-component/destroy.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable, of, zip } from 'rxjs';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.scss']
})
export class ToolComponent extends DestroyComponent implements OnInit {
  // topSymbols$: Observable<any[]> = this.projectService.getTopSymbols();
  public isCollapsed = true;

  topSymbols: any[] = [];
  symbols: any[] = [];
  active = 1;
  stocks: any[] = [];
  volstocks: any[] = [];
  threredstocks: any[] = [];

  constructor(
    private modalService: NgbModal,
    private projectService: ProjectService,
    private spinnerService: NgxSpinnerService,
    private _toastrService: ToastrService,
    private ref: ChangeDetectorRef
  ) {
    super();
    this.getSymbols();
  }

  ngOnInit() {
    console.log('this.symbols', this.symbols);

  }

  getSymbols() {
    const _symbols = this.catchErrorDrop(this.projectService.getSymbols(), '');
    forkJoin([_symbols]).pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe(results => {
      const [symbols]: any = results;
      this.symbols = symbols;
      if (symbols?.length) {
        this.onGetListRsi();
      }
    });
  }
  catchErrorDrop(url, message) {
    return url.pipe(
      takeUntil(this._unsubscribeAll),
      catchError(err => {
        this._toastrService.error(message);
        return of([]);
      })
    );
  }
  onGetListRsi() {
    this.stocks = [];
    this.symbols.forEach(symbol => {
      this.projectService.getHistorical(symbol.symbol, 21).subscribe(data => {
        if (data?.length && data[0].dealVolume > 356000) {
          data.forEach((d, index) => {
            if (index < data.length - 1) {
              d.change = (d.priceClose / d.adjRatio) - (data[index + 1].priceClose / data[index + 1].adjRatio);
              if (d.change >= 0) {
                d.up = d.change;
                d.down = 0;
              } else {
                d.up = 0;
                d.down = (d.change) * (-1);
              }
            }
            return d;
          });
          let upt = 0;
          let downt = 0;
          data.forEach((f, index) => {
            if (index < data.length - 1 &&  f.up >= 0) {
              upt += f.up;
            }
            if (index < data.length - 1 &&  f.down >= 0) {
              downt += f.down;
            }
          });
          console.log(`${data[0].symbol}`, data);

          const avgu = upt/(data.length - 1);
          const avgd = downt/(data.length - 1);

          let rs;
          let rsi;
          if (avgu && avgd) {
            rs = avgu/avgd;
            rsi = 100 - 100/(1 + rs);
          } else {
            rsi = 0;
          }
          data[0].rsi = rsi;
          if (rsi <= 40) {
            this.stocks.push(data[0]);
            this.ref.markForCheck();
          }
          console.log(`${data[0].symbol}`, rsi);
        }
      });
    });
  }

  getListVolUp() {
    this.volstocks = [];
    this.symbols.forEach(symbol => {
      this.projectService.getHistorical(symbol.symbol, 26).subscribe(data => {
        if (data?.length && data[0].dealVolume > 356000) {
          data.forEach((d, index) => {
            if (index < data.length - 1) {
              d.change = (d.priceClose / d.adjRatio) - (data[index + 1].priceClose / data[index + 1].adjRatio);
              if (d.change >= 0) {
                d.up = d.change;
                d.down = 0;
              } else {
                d.up = 0;
                d.down = (d.change) * (-1);
              }
            }
            return d;
          });
          let upt = 0;
          let downt = 0;
          let voltotal = 0;
          let pricetotal = 0;
          data.forEach((f, index) => {
            voltotal += f.dealVolume;
            pricetotal += (f.priceClose / f.adjRatio);
            if (index < data.length - 1 &&  f.up >= 0) {
              upt += f.up;
            }
            if (index < data.length - 1 &&  f.down >= 0) {
              downt += f.down;
            }
          });
          // console.log(`${data[0].symbol}`, data);

          const avgu = upt/(data.length - 1);
          const avgd = downt/(data.length - 1);
          const avgvol = voltotal/(data.length);
          const avgprice = pricetotal/(data.length);

          let rs;
          let rsi;
          if (avgu && avgd) {
            rs = avgu/avgd;
            rsi = 100 - 100/(1 + rs);
          } else {
            rsi = 0;
          }
          data[0].rsi = rsi;
          data[0].avgvol = avgvol;
          if (data[0].dealVolume > avgvol && data[0].change > 0.4 && data[1].change < 0.2) {
            this.volstocks.push(data[0]);
            this.ref.markForCheck();
          }


          // if (data[0].change < 0 && data[1].change < 0 && data[2].change < 0) {
          //   this.volstocks.push(data[0]);
          //   this.ref.markForCheck();
          // }

          // console.log(`${data[0].symbol}`, rsi);
        }
      });
    });
  }


  getListThrePrice() {
    this.threredstocks = [];
    this.symbols.forEach(symbol => {
      this.projectService.getHistorical(symbol.symbol, 9).subscribe(data => {
        if (data?.length && data[0].dealVolume > 356000) {
          data.forEach((d, index) => {
            if (index < data.length - 1) {
              d.change = (d.priceClose / d.adjRatio) - (data[index + 1].priceClose / data[index + 1].adjRatio);
              if (d.change >= 0) {
                d.up = d.change;
                d.down = 0;
              } else {
                d.up = 0;
                d.down = (d.change) * (-1);
              }
            }
            return d;
          });
          let upt = 0;
          let downt = 0;
          let voltotal = 0;
          let pricetotal = 0;
          data.forEach((f, index) => {
            voltotal += f.dealVolume;
            pricetotal += (f.priceClose / f.adjRatio);
            if (index < data.length - 1 &&  f.up >= 0) {
              upt += f.up;
            }
            if (index < data.length - 1 &&  f.down >= 0) {
              downt += f.down;
            }
          });
          // console.log(`${data[0].symbol}`, data);

          const avgu = upt/(data.length - 1);
          const avgd = downt/(data.length - 1);
          const avgvol = voltotal/(data.length);
          const avgprice = pricetotal/(data.length);

          let rs;
          let rsi;
          if (avgu && avgd) {
            rs = avgu/avgd;
            rsi = 100 - 100/(1 + rs);
          } else {
            rsi = 0;
          }
          data[0].rsi = rsi;
          // if (data[0].dealVolume > avgvol && data[0].change > 0.5 && data[1].change < 0.5) {
          //   this.volstocks.push(data[0]);
          //   this.ref.markForCheck();
          // }


          if (data[0].change < 0 && data[1].change < 0 && data[2].change < 0) {
            this.threredstocks.push(data[0]);
            this.ref.markForCheck();
          }

          // console.log(`${data[0].symbol}`, rsi);
        }
      });
    });
  }
}
