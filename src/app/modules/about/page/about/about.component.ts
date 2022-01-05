import { ChangeDetectorRef, Component } from '@angular/core';
import { ProjectService } from '@app/data/service/project.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  // topSymbols$: Observable<any[]> = this.projectService.getTopSymbols();
  public isCollapsed = true;

  topSymbols: any[] = [];
  constructor(
    private modalService: NgbModal,
    private projectService: ProjectService,
    private spinnerService: NgxSpinnerService,
    private _toastrService: ToastrService,
    private ref: ChangeDetectorRef
  ) {
    this.projectService.getTopSymbols().subscribe(data => {
      if (data) {
        data.forEach(element => {
          element.isCollapsed = true;
        });
        this.topSymbols = data;
      }
    });
  }
}
