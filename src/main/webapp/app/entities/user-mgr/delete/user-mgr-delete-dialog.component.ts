import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserMgr } from '../user-mgr.model';
import { UserMgrService } from '../service/user-mgr.service';

@Component({
  templateUrl: './user-mgr-delete-dialog.component.html',
})
export class UserMgrDeleteDialogComponent {
  userMgr?: IUserMgr;

  constructor(protected userMgrService: UserMgrService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userMgrService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
