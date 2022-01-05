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
}
