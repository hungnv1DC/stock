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

const COUNTRIES: Country[] = [
  {
    name: 'SSI',
    flag: 'f/f3/Flag_of_Russia.svg',
    area: 17075200,
    population: 146989754
  },
  {
    name: 'SHS',
    flag: 'c/c3/Flag_of_France.svg',
    area: 640679,
    population: 64979548
  },
  {
    name: 'VND',
    flag: 'b/ba/Flag_of_Germany.svg',
    area: 357114,
    population: 82114224
  },
  {
    name: 'HPG',
    flag: '5/5c/Flag_of_Portugal.svg',
    area: 92090,
    population: 10329506
  },
  {
    name: 'HSG',
    flag: 'c/cf/Flag_of_Canada.svg',
    area: 9976140,
    population: 36624199
  },
  {
    name: 'PVS',
    flag: '2/21/Flag_of_Vietnam.svg',
    area: 331212,
    population: 95540800
  },
  {
    name: 'PVD',
    flag: '0/05/Flag_of_Brazil.svg',
    area: 8515767,
    population: 209288278
  },
  {
    name: 'PVT',
    flag: 'f/fc/Flag_of_Mexico.svg',
    area: 1964375,
    population: 129163276
  },
  {
    name: 'GEX',
    flag: 'a/a4/Flag_of_the_United_States.svg',
    area: 9629091,
    population: 324459463
  },
  {
    name: 'KBC',
    flag: '4/41/Flag_of_India.svg',
    area: 3287263,
    population: 1324171354
  },
  {
    name: 'DIG',
    flag: '9/9f/Flag_of_Indonesia.svg',
    area: 1910931,
    population: 263991379
  },
  {
    name: 'HCM',
    flag: '3/38/Flag_of_Tuvalu.svg',
    area: 26,
    population: 11097
  },
  {
    name: 'VIC',
    flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
    area: 9596960,
    population: 1409517397
  }
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  projects$: Observable<Project[]> = this.projectService.getSymbols();
  symbols$: Observable<any[]> = this.projectService.getSymbols();

  page = 1;
  pageSize = 4;
  collectionSize = COUNTRIES.length;
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
    this.refreshCountries();
    this._toastrService.error('ádd');
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
  refreshCountries() {
    this.countries = COUNTRIES
      .map((country, i) => ({id: i + 1, ...country}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
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
