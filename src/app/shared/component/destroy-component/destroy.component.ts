import { Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'destroy-component',
  encapsulation: ViewEncapsulation.None,
  template: '',
})
export class DestroyComponent implements OnDestroy {
  public _unsubscribeAll: Subject<any> = new Subject();

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
