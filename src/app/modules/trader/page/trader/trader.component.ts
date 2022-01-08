import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '@app/data/service/project.service';
import { checkNullParams } from '@app/shared/common/utils';
import { BaseComponent } from '@app/shared/component/base-component/base.component';
import { DestroyComponent } from '@app/shared/component/destroy-component/destroy.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, finalize, map, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-trader',
  templateUrl: './trader.component.html',
  styleUrls: ['./trader.component.scss']
})
export class TraderComponent extends BaseComponent implements OnInit {
  // topSymbols$: Observable<any[]> = this.projectService.getTopSymbols();
  // myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  public isCollapsed = true;
  symbols: any[] = [];
  filteredOptions: Observable<string[]>;

  topQuestions: any[] = [];

  frm: FormGroup;
  isLoading: boolean;

  public controlConfig = {
    code: new FormControl('', [Validators.required]),
    question: new FormControl('', [Validators.required]),
  };
  public formErrors = {
    code: '',
    question: '',
  };
  public validationMessages = {
    code: {
      required: 'is required',
    },
    question: {
      required: 'is required',
    },
  };

  constructor(
    private modalService: NgbModal,
    private projectService: ProjectService,
    private spinnerService: NgxSpinnerService,
    private _toastrService: ToastrService,
    private ref: ChangeDetectorRef
  ) {
    super();

    this.projectService.getTopTraderQuestion().subscribe(data => {
      if (data) {
        data.forEach(element => {
          element.isCollapsed = true;
        });
        this.topQuestions = data;
      }
    });
    this.getSymbols();
  }
  ngOnInit() {
    super.ngOnInit();
    this.frm.reset();
    const { code } = this.frm.controls;
    this.filteredOptions = code.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value)),
    );
  }

  filter(value?: string): string[] {
    console.log('value', value);
    if (value) {
      const filterValue = value.toLowerCase();
      return this.symbols.filter(option => option.symbol.toLowerCase().includes(filterValue));
    }
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

  save(): void {
    const frmValue = this.frm.value;
console.log(frmValue);
    const body = Object.assign({}, checkNullParams(frmValue));
    this.createQuestion(body);


  }

  createQuestion(data) {
    this.isLoading = true;
    this.projectService
      .createQustion(data)
      .pipe(takeUntil(this._unsubscribeAll), finalize(() => this.isLoading = false))
      .subscribe(
        (resp) => {
          if (resp.code === 200) {
            this._toastrService.success(resp.message);
            this.frm.reset();
          }
        }, error => {
          const { meta } = error['error'];
          this._toastrService.error(meta && meta.message ? meta.message : 'CREATE_ERROR');
        });
        console.log(this.symbols);

  }
}
