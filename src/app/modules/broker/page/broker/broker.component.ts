import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '@app/data/service/project.service';
import { checkNullParams } from '@app/shared/common/utils';
import { BaseComponent } from '@app/shared/component/base-component/base.component';
import { DestroyComponent } from '@app/shared/component/destroy-component/destroy.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, finalize, map, startWith, takeUntil } from 'rxjs/operators';
import { DialogBrokerComponent } from '../../modal/dialog-broker/dialog-broker.component';

@Component({
  selector: 'app-broker',
  templateUrl: './broker.component.html',
  styleUrls: ['./broker.component.scss']
})
export class BrokerComponent extends BaseComponent implements OnInit {
  // topSymbols$: Observable<any[]> = this.projectService.getTopSymbols();
  // myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  public isCollapsed = true;
  symbols: any[] = [];
  filteredOptions: Observable<string[]>;

  topSymbols: any[] = [];

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
  public showFormDialogRef: MatDialogRef<DialogBrokerComponent>;

  constructor(
    private modalService: NgbModal,
    private projectService: ProjectService,
    private spinnerService: NgxSpinnerService,
    private _toastrService: ToastrService,
    private ref: ChangeDetectorRef,
    private _dialog: MatDialog

  ) {
    super();

    this.projectService.getTopBrokerQuestion().subscribe(data => {
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
    super.ngOnInit();
    this.frm.reset();
    const { code } = this.frm.controls;
    console.log( this.frm.controls);
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

  }

  showModalBroferAnswer(code?: string, user?: any) {
    this.showFormDialogRef = this._dialog
    .open(DialogBrokerComponent, {
      disableClose: true,
      data: {
        title: '',
        code,
        tName: user.tName,
        content: user.content
      }
    });
  }
}
