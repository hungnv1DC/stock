import { BaseComponent } from '@app/shared/component/base-component/base.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from '@app/data/service/project.service';
import { finalize, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-dialog-broker',
  templateUrl: './dialog-broker.component.html',
  styleUrls: ['./dialog-broker.component.scss']
})
export class DialogBrokerComponent extends BaseComponent implements OnInit {
  public frm: FormGroup;
  public controlConfig = {
    price: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
  };
  public formErrors = {
    price: '',
    code: '',
    content: ''
};;
  public validationMessages = {
    price: {
      required: 'required',
    },
    code: {
        required: 'required',
    },
    content: {
      required: 'required',
  },
  };
  public isPrefix: boolean;
  isLoading: boolean;
  constructor(
    public dialogRef: MatDialogRef<DialogBrokerComponent>,
    private projectService: ProjectService,
    private _toastrService: ToastrService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super();
  }
  ngOnInit() {
    super.ngOnInit();
    console.log('data', this.data);
    if (this.data?.code) {
      this.frm.controls.code.patchValue(this.data.code || '');
      this.frm.controls.code.disable();
    }
  }
  submit(): void {
    const frmValue = this.frm.value;
    console.log(frmValue);
    for (const key in frmValue) {
      if (Object.prototype.hasOwnProperty.call(frmValue, key)) {
        frmValue[key] = frmValue[key]?.toString().trim();
      }
    }
    frmValue.code = this.data.code;
    this.isLoading = true;
    this.projectService
      .recommendQuestion(frmValue)
      .pipe(takeUntil(this._unsubscribeAll), finalize(() => {
        this.isLoading = false;
        this.resetForm();
        this.dialogRef.close();
      }))
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

  close() {
    this.resetForm();
    this.dialogRef.close(false);
  }

  resetForm() {
    this.frm.reset();
  }
}

