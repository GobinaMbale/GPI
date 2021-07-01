import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISessionEnseignement } from '../session-enseignement.model';
import { SessionEnseignementService } from '../service/session-enseignement.service';

@Component({
  templateUrl: './session-enseignement-delete-dialog.component.html',
})
export class SessionEnseignementDeleteDialogComponent {
  sessionEnseignement?: ISessionEnseignement;

  constructor(protected sessionEnseignementService: SessionEnseignementService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sessionEnseignementService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
