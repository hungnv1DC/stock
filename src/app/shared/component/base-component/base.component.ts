import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { DestroyComponent } from '../destroy-component/destroy.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'base-component',
  encapsulation: ViewEncapsulation.None,
  template: ''
})
export class BaseComponent extends DestroyComponent implements OnInit {
  public frm: any;
  public formErrors: any;
  public validationMessages: any;
  public controlConfig: any;

  public ngOnInit() {
    this.buildForm();
  }

  public buildForm() {
    this.frm = new FormGroup(this.controlConfig);

    this.frm.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  public revalidateOnChanges(control): void {
    if (control && control._parent && !control._revalidateOnChanges) {
      control._revalidateOnChanges = true;
      control._parent.valueChanges
        .distinctUntilChanged((a, b) => {
          // These will always be plain objects coming from the form, do a simple comparison
          if ((a && !b) || (!a && b)) {
            return false;
          } else if (a && b && Object.keys(a).length !== Object.keys(b).length) {
            return false;
          } else if (a && b) {
            for (const i in a) {
              if (a[i] !== b[i]) {
                return false;
              }
            }
          }
          return true;
        })
        .subscribe(() => {
          control.updateValueAndValidity();
        });

      control.updateValueAndValidity();
    }
    return;
  }

  public conditional(conditional, validator) {
    return control => {
      this.revalidateOnChanges(control);

      if (control && control._parent) {
        if (conditional(control._parent)) {
          return validator(control);
        }
      }
    };
  }

  public onValueChanged(data?: any) {
    if (!this.frm) {
      return;
    }

    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        const control = this.frm.get(field);
        if (control && !control.valid) {
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] = this.validationMessages[field][key] + ' ';
              break;
            }
          }
        }
      }
    }
  }

  public showFormError() {
    let errorMessage = '';
    if (!this.frm) {
      return errorMessage;
    }

    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        const control = this.frm.get(field);
        if (control) {
          control.markAsTouched({ onlySelf: true });
        }
        if (control && !control.valid) {
          if (control.controls) {
            for (const fieldChild in control.controls) {
              if (this.formErrors[field].hasOwnProperty(fieldChild)) {
                const controlChild = this.frm.controls[field].get(fieldChild);
                if (controlChild) {
                  controlChild.markAsTouched({ onlySelf: true });
                }
                if (controlChild && !controlChild.valid) {
                  for (const keyChild in controlChild.errors) {
                    if (controlChild.errors.hasOwnProperty(keyChild)) {
                      const messages = this.validationMessages[field][fieldChild][keyChild];
                      this.formErrors[field][fieldChild] = messages + ' ';
                      errorMessage += messages.length ? ('- ' + messages + '<br/>') : '';
                      break;
                    }
                  }
                }
              }
            }
            continue;
          }
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              const messages = this.validationMessages[field][key];
              if (messages) {
                this.formErrors[field] = messages + ' ';
                errorMessage += messages.length ? ('- ' + messages + '<br/>') : '';
              }
              break;
            }
          }
        }
      }
    }

    return errorMessage;
  }

  public disableFormControls(listFields) {
    for (const key in listFields) {
      if (this.frm.controls.hasOwnProperty(key)) {
        this.frm.controls[key].disable();
      }
    }
  }

  public enableFormControls(listFields) {
    for (const key in listFields) {
      if (this.frm.controls.hasOwnProperty(key)) {
        this.frm.controls[key].enable();
      }
    }
  }

  public resetFormControls(listFields) {
    for (const key in listFields) {
      if (this.frm.controls.hasOwnProperty(key)) {
        this.frm.controls[key].reset();
      }
    }
  }
}
