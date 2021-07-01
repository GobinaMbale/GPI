import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEnseigner } from '../enseigner.model';
import { EnseignerService } from '../service/enseigner.service';

@Component({
  templateUrl: './enseigner-delete-dialog.component.html',
})
export class EnseignerDeleteDialogComponent {
  enseigner?: IEnseigner;

  constructor(protected enseignerService: EnseignerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.enseignerService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
