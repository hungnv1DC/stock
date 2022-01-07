import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProjectService } from '@app/data/service/project.service';
import { DestroyComponent } from '@app/shared/component/destroy-component/destroy.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent extends DestroyComponent implements OnInit {
  // topSymbols$: Observable<any[]> = this.projectService.getTopSymbols();
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  public isCollapsed = true;
  symbols: any[] = [];
  filteredOptions: Observable<string[]>;

  topSymbols: any[] = [];
  constructor(
    private modalService: NgbModal,
    private projectService: ProjectService,
    private spinnerService: NgxSpinnerService,
    private _toastrService: ToastrService,
    private ref: ChangeDetectorRef
  ) {
    super();

    this.projectService.getTopSymbols().subscribe(data => {
      if (data) {
        data.forEach(element => {
          element.isCollapsed = true;
        });
        this.topSymbols = data;
      }
    });
    this.getSymbols();
  }
  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value)),
    );
  }

  filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.symbols.filter(option => option.symbol.toLowerCase().includes(filterValue));
  }

  getSymbols() {
    const _symbols = this.catchErrorDrop(this.projectService.getSymbols(), '');
    forkJoin([_symbols]).pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe(results => {
      const [symbols]: any = results;
      this.symbols = symbols;
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
}
