import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProjectService } from '@data/service/project.service';
import { Project } from '@data/schema/project';
import { MyModalComponent } from '../modal/my-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { catchError, takeUntil } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
interface Country {
  id?: number;
  name: string;
  flag: string;
  area: number;
  population: number;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  symbols$: Observable<any[]> = this.projectService.getSymbols();

  page = 1;
  pageSize = 4;
  countries: Country[];
  stocks: any[] = [];

  constructor(
    private modalService: NgbModal,
    private projectService: ProjectService,
    private spinnerService: NgxSpinnerService,
    private _toastrService: ToastrService,
    private datePipe: DatePipe,
    private ref: ChangeDetectorRef
  ) {
  }

  onCheckStock() {
    this.symbols$.subscribe(symbols => {
      if (symbols?.length) {
        symbols.forEach(e => {
          this.projectService.getHistorical(e.symbol).subscribe(data => {
            if (data?.length && data[0].dealVolume > 560000) {
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

              if (rsi <= 40) {
                this.stocks.push(data[0]);
                this.ref.markForCheck();
              }
              console.log(`${data[0].symbol}`, rsi);
            }
          });
        });
      }
    });

  }

  ngOnInit() {
    /** spinner starts on init */
    // this.spinnerService.show();

    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinnerService.hide();
    // }, 5000);
  }

  openMyModal() {
    const modalRef = this.modalService.open(MyModalComponent);
    modalRef.componentInstance.id = 1;
    modalRef.result.then(
      result => {
        console.log(result);
      },
      error => {
        console.log(error);
      }
    );
  }
}
