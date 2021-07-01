import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IReserverMateriel } from '../reserver-materiel.model';
import { ReserverMaterielService } from '../service/reserver-materiel.service';

@Component({
  templateUrl: './reserver-materiel-delete-dialog.component.html',
})
export class ReserverMaterielDeleteDialogComponent {
  reserverMateriel?: IReserverMateriel;

  constructor(protected reserverMaterielService: ReserverMaterielService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.reserverMaterielService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
