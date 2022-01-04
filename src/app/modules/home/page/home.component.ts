import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProjectService } from '@data/service/project.service';
import { Project } from '@data/schema/project';
import { MyModalComponent } from '../modal/my-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
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

  constructor(
    private modalService: NgbModal,
    private projectService: ProjectService,
    private spinnerService: NgxSpinnerService,
    private _toastrService: ToastrService,

  ) {
    this.refreshCountries();
    this._toastrService.error('ádd');
    // this.projects$.subscribe(data => {
    //   // console.log(data);
    // });

  }

  onCheckStock() {
    const _brands = this.catchErrorDrop(this._uskuManagementService.getBrands(), CONSTANTS.CANNOT_LOAD_BRAND);
    const _categories = this.catchErrorDrop(this._uskuManagementService.getCategories(), CONSTANTS.CANNOT_LOAD_CATEGORY);
    const _manufacturers = this.catchErrorDrop(this._uskuManagementService.getManufacturers(), CONSTANTS.CANNOT_LOAD_MANUFACTURERS);
    forkJoin([_brands, _categories, _manufacturers]).pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe(results => {
      const [brands, categories, manufacturers]: any = results;

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
